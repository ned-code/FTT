
# UniboardDocument is basically a container of pages. Following attributes are available:
#- uuid: string
#- title: string
#- status: string
#- metadata_media_id: integer
#- bucket: string
#- version: integer
#- deleted_at: datetime
#
class UbDocument < ActiveRecord::Base
  acts_as_authorizable

  # Set this defaults scope in find_every_with_deleted method
  default_scope :order => 'updated_at DESC', :conditions => {:deleted_at => nil},
    :include => [:pages]

  has_many :pages, :class_name => 'UbPage', :foreign_key => 'uniboard_document_id',
    :order => 'position ASC', :autosave => true, :dependent => :destroy
  belongs_to :media, :class_name => 'UbMedia', :foreign_key => 'metadata_media_id', :autosave => true

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  class << self

    # Add find option named with_deleted. This option can be set to true if you
    # want retrive all documents (including deleted)
    VALID_FIND_OPTIONS << :with_deleted

    # Override default_scope if find with option with_deleted set to true
    def find_every_with_deleted(options)
      with = options.delete(:with_deleted)

      if with
        with_exclusive_scope(:find => {
            :order => "#{table_name}.updated_at ASC",
            :include => [:pages]
          }) do
          find_every_without_deleted(options)
        end
      else
        find_every_without_deleted(options)
      end
    end
    alias_method_chain(:find_every, :deleted)

  end


  def update_with_ub(ub_stream, modified_medias)

    @pages_to_delete_on_storage = []
    document_desc = REXML::Document.new(ub_stream)
    # First check version of document (optimistic locking).
    @error_on_version = true if !new_record? && version != 1 && version > document_desc.root.attribute(:version).value.to_i
    # update metadata
    if (!@error_on_version)
      # if metadata of document are changed, we parse the rdf to update metadata
      if (modified_medias.include?(self.uuid))
        rdf_media = UbMedia.find_by_uuid(self.uuid)
        raise UbMediaMissingError, "Meta data media for document #{self.uuid} is missing" if rdf_media == nil
        self.media = rdf_media unless rdf_media == self.media
        self.parse_metadata_rdf_file(rdf_media.data)
      end
    end

    # Now treat each pages of the document
    old_pages = pages.dup
    page_position = 0
    document_desc.root.each_element('pages/page') do |page_element|
      
      page_uuid = page_element.text.match(UUID_FORMAT_REGEX)[0]
      page_position += 1

      page = old_pages.delete( old_pages.find {|e| e.uuid == page_uuid} ) || pages.build(:uuid => page_uuid)
      page.position = page_position unless page.position == page_position

      # update the page only if page is modified.
      if (modified_medias.include?(page_uuid))
        page_media = UbMedia.find_by_uuid(page_uuid)
        raise UbMediaMissingError, "Document #{self.uuid} refers a non existing page #{page_uuid}" if page_media == nil
        page.media = page_media unless page_media == page.media
        page.update_page_from_media
      elsif page.new_record?
        raise UbMediaMissingError, "No media found for new page #{page_uuid}"
      end
    end

    # delete no more used pages.
    old_pages.each do |page|
      page.mark_for_destruction
      @pages_to_delete_on_storage << page.uuid
    end
    increment_version if self.changed? || @pages_to_delete_on_storage.length || modified_medias.length
  end

  def resources_json
      result_hash = {}
      medias_list = []
      self.pages.each do |a_page|
        # add all media used by the page
        a_page.page_elements.each do |a_page_element|
          unless (a_page_element.media.nil?)
            medias_list << a_page_element.media.public_url
          end
        end
        medias_list << a_page.media.get_resource(UbMedia::UB_DRAWING_TYPE).public_url
      end
      result_hash['mediasUrl'] = medias_list
      return result_hash.to_json
  end
  
  def to_xml(options = {})
    require 'builder' unless defined?(Builder)

    options[:indent] ||= 2
    options.reverse_merge!({:builder => Builder::XmlMarkup.new(:indent => options[:indent])})
    options[:builder].instruct! unless options.delete(:skip_instruct)

    options[:page_url] ||= false

    options[:builder].document('xmlns' => XML_UNIBOARD_DOCUMENT_NAMESPACE,
      'uuid' => uuid,
      'version' => version,
      'public' => is_public,
      'created-at' => created_at.xmlschema,
      'updated-at' => updated_at.xmlschema) do |xml_document|
      
      #Add metadata rdf
      xml_document.media((options[:page_url] ? self.media.public_url : ''),
        'uuid' => self.media.uuid,
        'version' => self.media.version,
        'created-at' => self.media.created_at.xmlschema,
        'updated-at' => self.media.updated_at.xmlschema,
        'file-name' => self.media.path)
      self.pages.each do |a_page|
        # add the page media
        xml_document.media((options[:page_url] ? a_page.media.public_url : ''),
          'uuid' => a_page.media.uuid,
          'version' => a_page.media.version,
          'created-at' => a_page.media.created_at.xmlschema,
          'updated-at' => a_page.media.updated_at.xmlschema,
          'file-name' => a_page.media.path,
          'page-number' => a_page.position)
        # add all media used by the page
        a_page.page_elements.each do |a_page_element|
          unless (a_page_element.media.nil?)
            xml_document.media((options[:page_url] ? a_page_element.media.public_url : ''),
              'uuid' => a_page_element.media.uuid,
              'version' => a_page_element.media.version,
              'created-at' => a_page_element.media.created_at.xmlschema,
              'updated-at' => a_page_element.media.updated_at.xmlschema,
              'file-name' => a_page_element.media.path)
          end
        end
      end
    end
  end

  # Mark document deleted and destroy associated pages and resources and files on storage.
  alias_method :destroy_without_mark_deleted, :destroy
  def destroy
    transaction do
      unless new_record?
        connection.update("
          UPDATE #{self.class.quoted_table_name}
          SET #{connection.quote_column_name('deleted_at')} = #{quote_value(self.deleted_at = Time.now.utc)}
          WHERE #{connection.quote_column_name(self.class.primary_key)} = #{quote_value(id)}
          ", "#{self.class.name} marke Destroyed"
        )
      end

      pages.each do |page|
        page.destroy
      end
    end

    freeze
  end

  # Normal ActiveRecord Destroy process (set 'deleted_at' attribute
  # to compatibility with custom destroy method)
  def destroy!
    self.deleted_at = Time.now.utc unless frozen?

    destroy_without_mark_deleted
  end

  # Return true if document is deleted or destroyed
  def deleted?
    !self.deleted_at.nil?
  end

  protected

  # Parse the document rdf stream to find all metadata that must be stored in the database.
  # Currently only document title is extracted.
  #
  def parse_metadata_rdf_file(file_stream)
        rdf_document = XMLObject.new(file_stream)
        self.title = rdf_document.Description.title
  end

  def increment_version
    self.version += 1
  end
end
