require 'rexml/document'

class UniboardDocument < ActiveRecord::Base
  acts_as_authorizable

  has_many :pages, :class_name => 'UniboardPage', :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
  validates_presence_of :bucket

  before_update :increment_version
  after_save :upload_file_to_s3
  after_destroy :destroy_file_on_s3

  cattr_reader :config

  def initialize(*args)
    super

    @@config ||= YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]

    unless AWS::S3::Base.connected?
      AWS::S3::Base.establish_connection!(
          :access_key_id     => @@config['access_key_id'],
          :secret_access_key => @@config['secret_access_key'],
          :use_ssl           => @@config['use_ssl'] || true
        )
    end

    self.bucket = @@config['bucket']
  end

  def file=(file)
    @error_on_file = false

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
        document_desc = REXML::Document.new(content.get_input_stream("#{uuid}.ub").read)

        page_position = 0
        document_desc.root.each_element('pages/page') do |page_element|
          page_uuid = page_element.text.match(UUID_FORMAT_REGEX)[0]
          page_position += 1

          page = pages.to_a.find {|e| e.uuid == page_uuid} || pages.build(:uuid => page_uuid)

          page.updated_at = Time.now if content.find_entry(page_element.text)
          page.position = page_position if page.position != page_position
        end
      end
    rescue
      @error_on_file = true
      return nil
    end

    @tempfile = file
  end

  def url
    AWS::S3::S3Object.url_for("#{uuid}.ubz", bucket)
  end

  private

    def upload_file_to_s3
      return unless @tempfile

#      AWS::S3::Bucket.objects(bucket, :prefix => uuid).collect{|object| object.path}.each do |object_path|
#        next if object_path =~ /#{uuid}.ubz$/
#
#        AWS::S3::S3Object.delete(object_path, bucket)
#      end

      Zip::ZipInputStream::open(@tempfile) do |file|
        while (entry = file.get_next_entry)
          next if entry.name =~ /\/$/
          s3_file_name = entry.name.gsub(/^(.*)\/$/, "#{uuid}/\\1")
          s3_file_access = s3_file_name =~ Regexp.union(/^\w+\/#{UUID_FORMAT_REGEX}\.svg$/, /^\w+[^\/]$/) ? :private : :public_read

          AWS::S3::S3Object.store(s3_file_name, file.read, bucket, :access => s3_file_access)
        end
      end

      @tempfile = nil
    end

    def destroy_file_on_s3
      AWS::S3::Bucket.objects(bucket, :prefix => uuid).collect{|object| object.path}.each do |object_path|
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
