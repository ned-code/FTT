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

# Storages
# TODO: After refactoring storage ?
#require 'storage/filesystem'
#require 'storage/s3'

# Set basedir for filesystem storage to spec tmp directory
STORAGE_FILESYSTEM_BASEDIR = File.join(RAILS_ROOT, 'spec', 'tmp', 'files', 'documents')

# Load ubz file list
UBZ_FIXTURES = {}
USED_UBZ_FIXTURES = []
Dir[File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', "*")].each do |type_dir|
  UBZ_FIXTURES[File.basename(type_dir).to_sym] ||= []
  Dir[File.join(type_dir, "*.ubz")].each do |ubz|
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
    # Remove files created by 'fixture_file' method
    Dir[File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures', '*')].each do |file|
      FileUtils.rm_rf file
    end

    # Remove all keys on S3 test bucket (nothing processed if RightAws::S3 is mucked)
    # TODO: After refactoring storage ?
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
def mock_uploaded_ubz(file, uuid = nil)
  file = fixture_file(file, uuid)

  uploaded_file = ActionController::TestUploadedFile.new(file)
  uploaded_file.uuid = file.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/) ? $1 : nil

  uploaded_file
end

def fixture_file(source, uuid = nil)
  @uuid_generator ||= UUID.new

  if source =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.ubz$/
    type = source.match(/[\d\-]+(\w+)\.ubz$/) ? $1 : raise("not found type for this ubz file: #{source}")

    target = generate_ubz(type, uuid)
  else
    target = source !~ /^\// ? File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', source) : source
  end

  target
end

def generate_ubz(type, uuid = nil)
  UBZ_FIXTURES[type.to_sym] ||= []
  source = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz_source', type.to_s)

  if uuid.nil?
    UBZ_FIXTURES[type.to_sym].each do |target|
      target_uuid = File.basename(target, '.ubz')
      next if USED_UBZ_FIXTURES.include?(target_uuid)

      USED_UBZ_FIXTURES << target_uuid
      return target
    end
  else
    target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, "#{uuid}.ubz")

    if File.exists?(target)
      USED_UBZ_FIXTURES << uuid
      return target
    end
  end

  USED_UBZ_FIXTURES << uuid ||= UUID.generate
  UBZ_FIXTURES[type.to_sym] << target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, "#{uuid}.ubz")

  FileUtils.mkdir_p File.dirname(target)

  Zip::ZipFile.open(target, Zip::ZipFile::CREATE) do |zip|
    Dir[File.join(source, '**', '**')].sort.each do |filepath|
      filename = filepath.gsub(File.join(source, ''), '')
      filename.gsub!(/(.*)\w{8}-\w{4}-\w{4}-\w{4}-\w{12}(\.ub)$/, '\1' + uuid + '\2') if filename =~ /\.ub$/

      if File.directory?(filepath)
        zip.dir.mkdir(filename)
      else
        zip.file.open(filename, "w") {|f| f.puts File.read(filepath) }
      end

    end
  end

  target
end
