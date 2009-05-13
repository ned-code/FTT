class UniboardDocument < ActiveRecord::Base
  acts_as_authorizable

  # Set this defaults scope in find_every_with_deleted method
  default_scope :order => 'updated_at DESC', :conditions => {:deleted_at => nil}, :include => [:pages]

  has_many :pages, :class_name => 'UniboardPage', :foreign_key => 'uniboard_document_id', :order => 'position ASC', :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  after_initialize :initialize_storage
  before_update :increment_version
  before_save :save_payload
  after_destroy :destroy_payload

  class << self

    # Add find option named with_deleted. This option can be set to true if you want retrive all documents (including deleted)
    VALID_FIND_OPTIONS << :with_deleted

    # Override default_scope if find with option with_deleted set to true
    def find_every_with_deleted(options)
      with = options.delete(:with_deleted)

      if with
        with_exclusive_scope(:find => { :order => "#{table_name}.updated_at ASC", :include => [:pages] }) do
          find_every_without_deleted(options)
        end
      else
        find_every_without_deleted(options)
      end
    end
    alias_method_chain(:find_every, :deleted)

    def config
      @@config ||= Struct.new('UniboardDocumentConfiguration', :storage, :storage_config).new(
        :storage => :filesystem
      )

      yield @@config if block_given?

      @@config
    end
  end

  def config
    self.class.config
  end

  def payload=(payload)
    @error_on_file = @error_on_version = false
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
      @error_on_file = true
      logger.debug "Error in uploaded uniboard document: data is empty"
      return nil
    end

    # Create tempfile
    payload.rewind
    @tempfile = Tempfile.new("#{rand Time.now.to_i}-#{uuid}.ubz")
    @tempfile.binmode
    @tempfile.write payload.read
    @tempfile.close

    # Test document file
    begin
      Zip::ZipFile.open(@tempfile.path) do |content|
        old_pages = pages.dup
        document_desc = REXML::Document.new(content.get_input_stream("#{uuid}.ub").read)

        logger.debug "Receive uniboard document - description:\n" + document_desc.to_s

        @error_on_version = true if !new_record? && version != document_desc.root.attribute(:version).value.to_i

        page_position = 0
        document_desc.root.each_element('pages/page') do |page_element|
          page_uuid = page_element.text.match(UUID_FORMAT_REGEX)[0]
          page_position += 1

          logger.debug "Receive uniboard document - page UUID: #{page_uuid}"
          logger.debug "Receive uniboard document - page position: #{page_position}"

          page = old_pages.delete( old_pages.find {|e| e.uuid == page_uuid} ) || pages.build(:uuid => page_uuid)

          page.version += 1 if !page.new_record? and content.find_entry("#{page_uuid}.svg")
          page.position = page_position if page.position != page_position
        end

        old_pages.each do |page|
          page.mark_for_destruction
          @pages_to_delete_on_storage << page.uuid
        end
      end
    rescue => e
      logger.debug "Error in uploaded uniboard document: " + e
      @error_on_file = true
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

    options[:builder].document('xmlns' => 'http://www.mnemis.com/uniboard',
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
        connection.update(
          "UPDATE #{self.class.quoted_table_name} " +
          "SET \"deleted_at\" = #{quote_value(self.deleted_at = Time.now.utc)} " +
          "WHERE #{connection.quote_column_name(self.class.primary_key)} = #{quote_value(id)}",
          "#{self.class.name} marke Destroyed"
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

  private

    def get_content_type_from_mime_types(filename)
      MIME::Types.of(File.extname(filename)).first.content_type
    rescue
      nil
    end

    def increment_version
      self.version += 1
    end

    # Validations
    def validate
      errors.add('version', "have already changed on server")  if @error_on_version
      errors.add('file', "has invalid format") if @error_on_file
      errors.add('uuid', "have changed") if !uuid_was.blank? and uuid_changed?
    end

    # Storage
    def initialize_storage
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
end
