class UniboardDocument < ActiveRecord::Base
  acts_as_authorizable

  has_many :pages, :class_name => 'UniboardPage', :order => 'position ASC', :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
  validates_presence_of :bucket

  before_update :increment_version
  before_save :upload_document_to_s3
  after_destroy :destroy_document_on_s3

  cattr_reader :config

  def initialize(*args)
    super

    @@config ||= YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]

    unless AWS::S3::Base.connected?
      AWS::S3::Base.establish_connection!(
          :access_key_id     => @@config['aws_access_key'],
          :secret_access_key => @@config['aws_secret_access_key'],
          :use_ssl           => @@config['use_ssl'] || true
        )
    end

    self.bucket = @@config['bucket_base_name']
  end

  def document=(file)
    @error_on_file = false
    @pages_to_delete = []

    if file.respond_to?(:path)
      file = File.expand_path(file.path)
    elsif file.is_a?(String) and File.file?(file)
      file = File.expand_path(file)
    else
      file = nil
    end

    self.uuid = File.basename(file, File.extname(file)) if file

    begin
      Zip::ZipFile.open(file) do |content|
        old_pages = pages.dup
        document_desc = REXML::Document.new(content.get_input_stream("#{uuid}.ub").read)

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
          @pages_to_delete << page.uuid
        end
      end
    rescue
      @error_on_file = true
      return nil
    end

    @tempfile = file
  end

  def to_xml(options = {})
    require 'builder' unless defined?(Builder)

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

  private

    def upload_document_to_s3
      return unless @tempfile

      @pages_to_delete.each do |page_uuid|
        AWS::S3::S3Object.delete("documents/#{uuid}/#{page_uuid}.svg", bucket)
        AWS::S3::S3Object.delete("documents/#{uuid}/#{page_uuid}.thumbnail.jpg", bucket)
      end

      Zip::ZipInputStream::open(@tempfile) do |file|
        while (entry = file.get_next_entry)
          next if entry.name =~ /\/$/ or entry.name == "#{uuid}.ub"
          s3_file_name = entry.name.gsub(/^(.*)\/$/, "documents/#{uuid}/\\1")
          s3_file_access = s3_file_name =~ /^\w+\/#{UUID_FORMAT_REGEX}\.svg$/ ? :private : :public_read

          AWS::S3::S3Object.store(s3_file_name, file.read, bucket, :access => s3_file_access)
        end
      end

      @tempfile = nil
    end

    def destroy_document_on_s3
      AWS::S3::Bucket.objects(bucket, :prefix => "documents/#{uuid}").collect{|object| object.path}.each do |object_path|
        AWS::S3::S3Object.delete(object_path, bucket)
      end
    end

    def increment_version
      self.version += 1
    end

    def validate
      errors.add('file', "has invalid format") if @error_on_file
      errors.add('uuid', "have changed") if !uuid_was.blank? and uuid_changed?
    end
end
