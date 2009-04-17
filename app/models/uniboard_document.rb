class UniboardDocument < ActiveRecord::Base
  validates_presence_of :uuid, :bucket

  after_save :upload_file_to_s3

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
    uuid = File.basename(file, File.extname(file))

    begin
      Zip::ZipFile.open(file) do |content|
        raise unless content.get_entry('metadata.rdf').file?
      end
    rescue
      raise ArgumentError, 'need ubz file'
    end

    @tempfile = file
    self.uuid = uuid
  end

  private

    def upload_file_to_s3
      return unless @tempfile

      AWS::S3::Bucket.objects(bucket, :prefix => uuid).collect{|object| object.path}.each do |object_path|
        next if object_path =~ /#{uuid}.ubz$/

        S3Object.delete(object_path, bucket)
      end

      Zip::ZipInputStream::open(@tempfile) do |file|
        while (entry = file.get_next_entry)
          next if entry.name =~ /\/$/
          s3_file_name = entry.name.gsub(/^(.*)\/$/, "#{uuid}/\\1")
          s3_file_access = s3_file_name =~ Regexp.union(/^\w+\/page\d+\.svg$/, /^\w+[^\/]$/) ? :private : :public_read

          AWS::S3::S3Object.store(s3_file_name, file.read, bucket, :access => s3_file_access)
          # @pages << s3_file_name if s3_file_name =~ /page\d+\.svg$/
        end
      end

      AWS::S3::S3Object.store("#{uuid}.ubz", File.open(@tempfile), bucket, :access => :private)

      @tempfile = nil
    end
end
