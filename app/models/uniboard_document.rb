require "conversion/html_conversion"

class UniboardDocument < ActiveRecord::Base
  acts_as_authorizable

  # Set this defaults scope in find_every_with_deleted method
  default_scope :order => 'updated_at DESC', :conditions => {:deleted_at => nil},
    :include => [:pages]

  has_many :pages, :class_name => 'UniboardPage', :foreign_key => 'uniboard_document_id',
    :order => 'position ASC', :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  before_update :increment_version
  before_save :save_payload
  after_destroy :destroy_payload

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

    def config
      @@config ||= Struct.new('UniboardDocumentConfiguration', :storage, :storage_config).new(
        :filesystem
      )

      yield @@config if block_given?

      @@config
    end
  end

  def config
    self.class.config
  end

  def payload=(payload)
    @error_on_payload = @error_on_version = false
    @pages_to_delete_on_storage = []

    # Extract UUID from filename
    if payload.respond_to?(:original_filename)
      self.uuid = File.basename(payload.original_filename, '.ubz')
      logger.debug "Receive uniboard document - UUID: #{uuid}"
    else
      logger.debug "Error in uploaded uniboard document: IO don't have 'original_filename' method"
    end

    # Return if file is empty
    if payload.blank? || payload.size == 0
      @error_on_payload = true
      logger.debug "Error in uploaded uniboard document: data is empty"
      return nil
    end

    # Create tempfile
    payload.rewind
    tempfile = Tempfile.new("#{rand Time.now.to_i}-#{uuid}.ubz")
    tempfile.binmode
    tempfile.write payload.read
    tempfile.close

    #extract zip file
    temp_file_path = tempfile.path
    if (@document_zip_path)
      FileUtils.remove_dir(@document_zip_path, true)
    end
    @document_zip_path = File.join(RAILS_ROOT, 'tmp', 'uncompressed_documents', File.basename(temp_file_path))
    logger.debug "document path " + @document_zip_path
    if (!File.exist?(@document_zip_path))
      FileUtils.mkdir_p(@document_zip_path)
    end
    
    Zip::ZipFile.foreach(temp_file_path) do |an_entry|
      #need to create sub folder if needed
      extracted_entry_path = File.join(@document_zip_path, an_entry.name)     
      if (!File.exist?(File.dirname(extracted_entry_path)))
        FileUtils.mkdir_p(File.dirname(extracted_entry_path))
      end
      an_entry.extract(File.join(@document_zip_path, an_entry.name))
    end 
    
    
    # Analyze document, convert it and update document and pages models
    begin       
    
      # First check version of document (optimistic locking).
      old_pages = pages.dup
      document_desc = REXML::Document.new(File.open(@document_zip_path + "/#{uuid}.ub").read)

      logger.debug "Receive uniboard document - description:\n" + document_desc.to_s

      @error_on_version = true if !new_record? && version != document_desc.root.attribute(:version).value.to_i

      if (!@error_on_version)
        # Create document html index. If there is an error on version we do not create html file because save will fail
        rdf_stream = File.open(@document_zip_path + "/metadata.rdf")
        ub_stream = File.open(@document_zip_path + "/#{uuid}.ub")
      
        index_html = HtmlConversion::create_html_document(uuid, ub_stream, rdf_stream)
           
        File.open(File.join(@document_zip_path, 'index.html'), 'w') do |file|
          file << index_html
        end
      end
      
      # Now treat each pages of the document
      page_position = 0
      document_desc.root.each_element('pages/page') do |page_element|
      
        # update page model
        page_uuid = page_element.text.match(UUID_FORMAT_REGEX)[0]
        page_position += 1

        logger.debug "Receive uniboard document - page UUID: #{page_uuid}"
        logger.debug "Receive uniboard document - page position: #{page_position}"

        page = old_pages.delete( old_pages.find {|e| e.uuid == page_uuid} ) || pages.build(:uuid => page_uuid)

        page.version += 1 if !page.new_record? and File.exist?(@document_zip_path + "/#{page_uuid}.svg")
        page.position = page_position if page.position != page_position
        
        if (!@error_on_version)
          # convert page to html if file exist. If file does not exist it is because page has not been updated so we do not convert it  
          if (File.exist?(@document_zip_path + "/#{page_uuid}.svg"))      
            svg_stream = File.open(@document_zip_path + "/#{page_uuid}.svg")
            page_html = HtmlConversion::convert_svg_page_to_html(page_uuid, svg_stream)
            File.open(File.join(@document_zip_path, "#{page_uuid}.xhtml"), 'w') do |file|
              file << page_html
            end
          end
        end
      end

      old_pages.each do |page|
        page.mark_for_destruction
        @pages_to_delete_on_storage << page.uuid
      end
      
    rescue => e
      logger.debug "Error in uploaded uniboard document: #{e.message}\n\n#{e.backtrace}"
      logger.debug "Error in uploaded uniboard document: " + e.backtrace.join("\n")
      @error_on_payload = true
      return nil
    end
        
  end

  def payload
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
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
      'created-at' => created_at.xmlschema,
      'updated-at' => updated_at.xmlschema) do |xml_document|
      xml_document.pages do |xml_pages|
        pages.each do |page|
          xml_pages.page((options[:page_url] ? page.url : ''),
            'uuid' => page.uuid,
            'version' => page.version,
            'created-at' => page.created_at.xmlschema,
            'updated-at' => page.updated_at.xmlschema)
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

      destroy_payload
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

  # Storage
  def after_initialize
    begin
      require "storage/#{config.storage}"
    rescue
      logger.error "Storage '#{config.storage}' can't be loaded, fallback to 'filesystem' storage"
      require 'storage/filesystem'
    end

    @storage_module = Storage.const_get(config.storage.to_s.capitalize).const_get('UniboardDocument')
    self.extend(@storage_module)
  end

  def save_payload
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def destroy_payload
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def increment_version
    self.version += 1
  end

  # Validations
  def validate
    errors.add('version', "have already changed on server")  if @error_on_version
    errors.add('payload', "has invalid format") if @error_on_payload
    errors.add('uuid', "have changed") if !uuid_was.blank? and uuid_changed?
    if (@document_zip_path && errors.length > 0)
        FileUtils.remove_dir(@document_zip_path, true)
        @document_zip_path = nil
    end
  end
end
