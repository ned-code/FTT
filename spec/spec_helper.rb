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

def fixture_ubz(type, uuid = nil)
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

  Dir[File.join(source, "**", "**")].each do |source_file|
    next if File.directory?(source_file)

    target_file = source_file.gsub(source, target)
    FileUtils.mkdir_p File.dirname(target_file)

    if target_file =~ /(\.ub|\.rdf)$/
      target_file = target_file.gsub(UUID_FORMAT_REGEX, uuid)
    end

    FileUtils.cp_r source_file, target_file
  end

  Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
end


def get_content_type_from_filename(filename)
  MIME::Types.of(File.extname(filename)).first.content_type
rescue
  nil
end