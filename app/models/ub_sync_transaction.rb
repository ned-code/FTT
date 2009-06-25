
class UbSyncTransactionError < StandardError; end

class UbSyncTransaction < ActiveRecord::Base
  has_many :items, :class_name => 'UbSyncTransactionItem', :foreign_key => 'ub_sync_transaction_id'

  validates_presence_of :uuid, :ub_client_uuid, :ub_document_uuid, :user_id

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
    raise UbSyncTransactionError, "Transaction isn't complete:\n#{errors.full_messages}" unless complete?

    if UbDocument.exists?(:uuid => ub_document_uuid)
      document = UbDocument.find(:first, :conditions => {:uuid => ub_document_uuid})
    else
      document = UbDocument.new(:uuid => ub_document_uuid)
    end

    item_processed = []

    tempfile = nil
    items.find(:all, :order => "path ASC, part_nb ASC").each do |item|
      next if item_processed.include?([item.path, item.part_nb])
      
      if item.part_total_nb > 1
        tempfile = Tempfile.new(item.path) if item.part_nb == 1
        tempfile << item.data.read

        if item.part_nb == item.part_total_nb
          tempfile.rewind
          raise UbSyncTransactionError, "Item '#{item.path}' parts can't be merged" if Digest::MD5.file(tempfile.path).hexdigest != item.item_hash_control
        end
      else
#        tempfile = item.data
      end

      UbMedia

      item_processed << [item.path, item.part_nb]
    end
  end
end
