
class UbSyncTransactionError < StandardError; end

class UbSyncTransaction < ActiveRecord::Base
  has_many :items, :autosave => true, :class_name => 'UbSyncTransactionItem', :foreign_key => 'ub_sync_transaction_id'
  belongs_to :user

  validates_presence_of :uuid, :ub_client_uuid, :ub_document_uuid, :user_id
  validates_uniqueness_of :ub_document_uuid, :message => 'already have open transaction'

  def to_xml(options = {})
    require 'builder' unless defined?(Builder)

    options[:indent] ||= 2
    options.reverse_merge!({:builder => Builder::XmlMarkup.new(:indent => options[:indent])})
    options[:builder].instruct! unless options.delete(:skip_instruct)

    options[:builder].transaction('xmlns' => XML_UNIBOARD_DOCUMENT_NAMESPACE,
      'uuid' => uuid,
      'client_uuid' => ub_client_uuid,
      'created-at' => created_at.xmlschema,
      'updated-at' => updated_at.xmlschema
    )
  end

  def complete?
    # Have items
    errors.add(:items, "can't be empty") if items.empty?

    # Have all parts for multi-part items
    items.find(:all, :conditions => "part_total_nb > 1", :group => "path").each do |multi_part_item|
      1.upto(multi_part_item.part_total_nb) do |part_nb|
        unless items.exists?(:path => multi_part_item.path, :part_nb => part_nb)
          errors.add(:items, "item '#{multi_part_item.path}' with '#{multi_part_item.part_total_nb}' parts don't have part '#{part_nb}'")
        end
      end
    end

    errors.empty? ? true : false
  end

  def commit
    return false unless save
    return false unless complete?

    if UbDocument.exists?(:uuid => ub_document_uuid)
      document = UbDocument.find(:first, :conditions => {:uuid => ub_document_uuid})
    else
      document = UbDocument.new(:uuid => ub_document_uuid)
    end

    # Open database transaction
    UbDocument.transaction do
      item_processed = []
      item_ub_document = nil
      media_uuids = []
      page_thumbnails = []
      data = nil

      items.find(:all, :order => "path ASC, part_nb ASC").each do |item|
        next if item_processed.include?([item.path, item.part_nb])

        # Merge multi-part items
        if item.part_total_nb > 1
          data = Tempfile.new(item.path) if item.part_nb == 1
          data << item.data.read

          if item.part_nb == item.part_total_nb
            data.rewind
            if Digest::MD5.file(data.path).hexdigest != item.item_check_sum
              errors.add(:items, "Item '#{item.path}' parts can't be merged")
              return false
            end
          end
        else
          data = {:path => item.storage_path, :storage_config => item.storage_config}
        end

        # Create media when last item
        if item.part_nb == item.part_total_nb
          if item.path =~ /\.ub$/
            item_ub_document = item
          elsif item.path =~ /\.thumbnail\.\w{3,4}$/
            page_thumbnails << item
          else

            # Parse UUID, and return error if none
            begin
              item_uuid = item.path.match(UUID_FORMAT_REGEX)[0]
            rescue
              errors.add(:items, "Item '#{item.path}' don't have UUID in path")
              return false
            end

            media = UbMedia.find_or_initialize_by_uuid(item_uuid)
            media.attributes = {
              :path => File.join("documents", document.uuid, item.path),
              :media_type => item.content_type,
              :data => data
            }

            unless media.save
              errors.add(:items, "Item '#{item.path}' can't be saved has media: #{media.errors.full_messages}")
              return false
            end
            media_uuids << media.uuid
          end
        end

        item_processed << [item.path, item.part_nb]
      end

      # Create media convertion with desktop thumbnail
      page_thumbnails.each do |item|
        page_media = UbMedia.find_by_uuid(item.path.match(UUID_FORMAT_REGEX)[0])
        page_media.conversions.create(
          :media_type =>  UbMedia::UB_THUMBNAIL_DESKTOP_TYPE,  #'ub_page/thumbnail+desktop',
          :path => page_media.path.match(/.*\//)[0] + item.path,
          :data => {:path => item.storage_path, :storage_config => item.storage_config}
        )
      end

      # Have UbDocument desc (.ub file) ?
      if item_ub_document.nil?
        errors.add(:items, "Transaction don't have Uniboard Document descrition file")
        return false
      else

        # Update from .ub and save document
        document.update_with_ub(item_ub_document.data, media_uuids)
        unless document.save
          errors.add(:items, "Document can't be saved")
          return false
        end
      end
    end

    true
  end
end
