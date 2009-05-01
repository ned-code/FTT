class UniboardDocument < ActiveRecord::Base
  acts_as_paranoid
  acts_as_authorizable

  has_many :pages, :class_name => 'UniboardPage', :order => 'position ASC', :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
  validates_presence_of :bucket

  before_validation :set_bucket
  before_update :increment_version
  before_save :upload_document_to_s3
  after_destroy :destroy_document_on_s3

  cattr_accessor :s3_config

  def payload=(payload)
    @error_on_file = @error_on_version = false
    @pages_to_delete_on_s3 = []

    # Extract UUID from filename
    if payload.respond_to?(:original_filename)
      self.uuid = File.basename(payload.original_filename, '.ubz')
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

        @error_on_version = true if !new_record? && version != document_desc.root.attribute(:version).value.to_i
        
        page_position = 0
        document_desc.root.each_element('pages/page') do |page_element|
          page_uuid = page_element.text.match(UUID_FORMAT_REGEX)[0]
          page_position += 1

          page = old_pages.delete( old_pages.find {|e| e.uuid == page_uuid} ) || pages.build(:uuid => page_uuid)

          page.version += 1 if !page.new_record? and content.find_entry("#{page_uuid}.svg")
          page.position = page_position if page.position != page_position
        end

        old_pages.each do |page|
          page.mark_for_destruction
          @pages_to_delete_on_s3 << page.uuid
        end
      end
    rescue => e
      logger.debug "Error in uploaded uniboard document: " + e
      @error_on_file = true
      return nil
    end
  end

  def to_xml(options = {})
    require 'builder' unless defined?(Builder)
    establish_connection!

    options[:indent] ||= 2
    options.reverse_merge!({:builder => Builder::XmlMarkup.new(:indent => options[:indent])})
    options[:builder].instruct! unless options.delete(:skip_instruct)

    options[:builder].document('xmlns' => 'http://www.mnemis.com/uniboard',
      'uuid' => uuid,
      'version' => version,
      'created-at' => created_at.xmlschema,
      'updated-at' => updated_at.xmlschema) do |xml_document|
      xml_document.pages do |xml_pages|
        pages.each do |page|
          xml_pages.page(AWS::S3::S3Object.url_for("documents/#{uuid}/#{page.uuid}.svg", bucket),
            'uuid' => page.uuid,
            'version' => page.version,
            'created-at' => page.created_at.xmlschema,
            'updated-at' => page.updated_at.xmlschema)
        end
      end
    end
  end

  #
  def destroy_with_keep_owner
    owners = self.has_owner

    destroy_without_keep_owner

    owners.each do |user|
      self.accepts_role 'owner', user
    end
  end
  alias_method_chain :destroy, :keep_owner

  private

    def s3_config
      self.class.s3_config
    end

    def establish_connection!
      logger.debug self.class.s3_config.inspect
      
      unless AWS::S3::Base.connected?
        AWS::S3::Base.establish_connection!(
            :access_key_id     => s3_config['aws_access_key'],
            :secret_access_key => s3_config['aws_secret_access_key'],
            :use_ssl           => s3_config['use_ssl'] || true,
            :persistent        => s3_config['persistent'] || true
          )
      end

      AWS::S3::Bucket.create(bucket) unless AWS::S3::Bucket.list.find {|b| b.name == bucket}
    end

    # Before save
    def upload_document_to_s3
      return unless @tempfile
      establish_connection!
      
      @pages_to_delete_on_s3.each do |page_uuid|
        AWS::S3::S3Object.delete("documents/#{uuid}/#{page_uuid}.svg", bucket)
        AWS::S3::S3Object.delete("documents/#{uuid}/#{page_uuid}.thumbnail.jpg", bucket)
      end
      @pages_to_delete_on_s3.clear

      Zip::ZipInputStream::open(@tempfile.path) do |file|
        while (entry = file.get_next_entry)
          next if entry.name =~ /\/$/ or entry.name == "#{uuid}.ub"
          s3_file_name = "documents/#{uuid}/#{entry.name}"
          s3_content_type = get_content_type_from_mime_types(s3_file_name)
          s3_file_access = s3_file_name =~ /#{UUID_FORMAT_REGEX}\.svg$/ ? :private : :public_read

          AWS::S3::S3Object.store(s3_file_name, file.read, bucket, :access => s3_file_access, :content_type => s3_content_type)
        end
      end

      @tempfile.close
      @tempfile = nil
    end

    def destroy_document_on_s3
      establish_connection!

      AWS::S3::Bucket.objects(bucket, :prefix => "documents/#{uuid}").collect{|object| object.path}.each do |object_path|
        AWS::S3::S3Object.delete(object_path, bucket)
      end
    end

    def get_content_type_from_mime_types(filename)
      MIME::Types.of(File.extname(filename)).first.content_type
    rescue
      nil
    end

    def increment_version
      self.version += 1
    end

    # Validations
    def set_bucket
      self.bucket ||= s3_config['bucket_base_name']
    end

    def validate
      errors.add('version', "have already changed on server")  if @error_on_version
      errors.add('file', "has invalid format") if @error_on_file
      errors.add('uuid', "have changed") if !uuid_was.blank? and uuid_changed?
    end
end
