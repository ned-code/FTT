ENV["RAILS_ENV"] = 'test'
require File.dirname(__FILE__) + "/../config/environment" unless defined?(RAILS_ROOT)
require 'spec'
require 'spec/autorun'
require 'spec/rails'
require 'email_spec/helpers'
require 'email_spec/matchers'

require 'fileutils'
require 'zip/zipfilesystem'

# Mocks
require 'spec/mocks/right_aws'

# Set basedir for filesystem storage to spec tmp directory
STORAGE_FILESYSTEM_BASEDIR = File.join(RAILS_ROOT, 'spec', 'tmp', 'files', 'documents')

# Load ubz file list
UBZ_FIXTURES = {}
USED_UBZ_FIXTURES = []
Dir[File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', "*")].each do |type_dir|
  UBZ_FIXTURES[File.basename(type_dir).to_sym] ||= []
  Dir[File.join(type_dir, "*")].each do |ubz|
    UBZ_FIXTURES[File.basename(type_dir).to_sym] << ubz
  end
end

Spec::Runner.configure do |config|
  config.use_transactional_fixtures = true
  config.use_instantiated_fixtures  = false
  config.fixture_path = RAILS_ROOT + '/spec/fixtures/'

  config.include(EmailSpec::Helpers)
  config.include(EmailSpec::Matchers)

  config.include(Authlogic::TestCase)

  config.before(:all) do
    # Set system tmp directory to spec tmp directory
    ENV['TMPDIR'] = File.join(RAILS_ROOT, 'spec', 'tmp')

    # Create directory for file fixtures created by 'fixture_file' method
    FileUtils.mkdir_p File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures')

    # Mock RightAws::S3 class if TEST_S3_CONNECTION environement variable is not set
    TEST_S3_CONNECTION = (ENV['TEST_S3_CONNECTION'] ? true : false) unless Object.const_defined?('TEST_S3_CONNECTION')
    unless TEST_S3_CONNECTION
      @mock_s3 = AppMocks::RightAws::S3.new
      RightAws::S3.stub!(:new).and_return(@mock_s3)
    end
  end

  config.before(:each) do
    USED_UBZ_FIXTURES.clear
  end

  config.after(:each) do
    # Remove files in spec tmp
    Dir[File.join(RAILS_ROOT, 'spec', 'tmp', '*')].each do |file|
      FileUtils.rm_rf file
    end

    # Remove all keys on S3 test bucket (nothing processed if RightAws::S3 is mucked)
    # TODO: Make a method to clear all S3 storage
    #    Storage::S3::Configuration.config.bucket.clear

    # Remove files created by filesystem storage system
    Dir[File.join(STORAGE_FILESYSTEM_BASEDIR, '*')].each do |file|
      FileUtils.rm_rf file
    end
  end

  config.after(:all) do
  end
end

# HTTP Response helper for rspec matchers
class ActionController::TestResponse

  # to test with "should be_unauthorized"
  def unauthorized?
    response_code == 401
  end

  # to test with "should be_forbidden"
  def forbidden?
    response_code == 403
  end

  # to test with "should be_not_found"
  def not_found?
    response_code == 404
  end

end

class ActionController::TestUploadedFile
  attr_accessor :uuid
end

# Get an uploaded UBZ file
#def mock_uploaded_ubz(file, uuid = nil)
#  file = fixture_file(file, uuid)
#
#  uploaded_file = ActionController::TestUploadedFile.new(file)
#  uploaded_file.uuid = file.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/) ? $1 : nil
#
#  uploaded_file
#end

def mock_uploaded_file(file)
  ActionController::TestUploadedFile.new(fixture_file(file))
end

def fixture_file(source)
  source !~ /^\// ? File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', source) : source
end

def fixture_ubz(type, uuid = nil, page_uuids = [])
  UBZ_FIXTURES[type.to_sym] ||= []
  source = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz_source', type.to_s)

  if uuid.nil?
    UBZ_FIXTURES[type.to_sym].each do |target|
      target_uuid = File.basename(target)
      next if USED_UBZ_FIXTURES.include?(target_uuid)

      USED_UBZ_FIXTURES << target_uuid
      return Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
    end
  else
    target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, uuid)

    if File.exists?(target)
      USED_UBZ_FIXTURES << uuid
      return Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
    end
  end

  USED_UBZ_FIXTURES << uuid ||= UUID.generate
  UBZ_FIXTURES[type.to_sym] << target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, uuid)

  ub_file = nil
  Dir[File.join(source, "**", "**")].each do |source_file|
    next if File.directory?(source_file)

    target_file = source_file.gsub(source, target)
    FileUtils.mkdir_p File.dirname(target_file)

    if target_file =~ /(\.ub|\.rdf)$/
      target_file = target_file.gsub(UUID_FORMAT_REGEX, uuid)
      ub_file = target_file
    elsif target_file =~ /page(\d{4})-\d{4}-\d{4}-\d{4}-\d{12}/
      page_position = $1.to_i - 1
      page_uuid = page_uuids[page_position] ||= UUID.generate
      target_file = target_file.gsub(/page\d{4}-\d{4}-\d{4}-\d{4}-\d{12}/, page_uuid)
    end

    FileUtils.cp_r source_file, target_file
  end

  content = File.read(ub_file)
  page_uuids.size.times do |i|
    content.gsub!(("page%04d-0000-0000-0000-000000000000" % (i + 1).to_s), page_uuids[i])
  end
  File.open(ub_file, 'wb') do |file|
    file << content
  end

  Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
end

def full_doc(doc_uuid = nil)
  doc_uuid ||= '12345678-1324-1234-1234-123456789123'
  page_1_uuid = UUID.generate
  page_2_uuid = UUID.generate
  page_3_uuid = UUID.generate
  document_files = fixture_ubz(:valid, doc_uuid, [page_1_uuid, page_2_uuid, page_3_uuid])
  document = Factory.create(:ub_document, :uuid => doc_uuid)
  storage = Storage::storage({:name => :filesystem})
  ub_file = nil
  page_position = 1
  thumbnails = []
  document_files.each do |a_file|

    if (File.basename(a_file) =~ /.*\.ub/)
      ub_file = a_file
    else
      file_path = "#{doc_uuid}/#{File.basename(a_file)}"
      if (File.basename(a_file) =~ /.*\.rdf/)
        media = Factory.create(:ub_media, :media_type => UbMedia::UB_DOCUMENT_TYPE, :uuid => File.basename(a_file, 'rdf')[0..-2], :path => file_path, :storage_config => storage.to_s)
        document.media = media
      elsif (File.basename(a_file) =~ /.*\.svg/)
        media = Factory.create(:ub_media, :media_type => UbMedia::UB_PAGE_TYPE, :uuid => File.basename(a_file, 'svg')[0..-2], :path => file_path, :storage_config => storage.to_s)
        page = Factory.create(:ub_page, :uuid => File.basename(a_file, 'svg')[0..-2], :position => page_position)
        page.media = media
        document.pages << page
        page_position += 1
      elsif (File.basename(a_file) =~ /.*\.thumbnail.*/)
        thumbnails << a_file
      end
      storage.put(file_path, File.open(a_file,'rb'))
    end
    document.save
  end
  thumbnails.each do |thumbnail_file|
    file_path = "#{doc_uuid}/#{File.basename(thumbnail_file)}"
    conversion = Factory.create(:ub_conversion, :media_type => UbMedia::UB_THUMBNAIL_DESKTOP_TYPE, :path => file_path)
    page_media = UbMedia.find_by_uuid(File.basename(thumbnail_file).match(UUID_FORMAT_REGEX)[0])
    page_media.conversions << conversion
    page_media.save
  end
  document = UbDocument.find_by_uuid(doc_uuid)
  return {:ub_file => ub_file, :document => document}
end

def get_content_type_from_filename(filename)
  MIME::Types.of(File.extname(filename)).first.content_type
rescue
  nil
end