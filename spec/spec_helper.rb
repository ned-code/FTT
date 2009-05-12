# This file is copied to ~/spec when you run 'ruby script/generate rspec'
# from the project root directory.
ENV["RAILS_ENV"] = "test"
require File.dirname(__FILE__) + "/../config/environment" unless defined?(RAILS_ROOT)
require 'spec'
require 'spec/autorun'
require 'spec/rails'
require 'email_spec/helpers'
require 'email_spec/matchers'
require 'fileutils'

require 'spec/mocks/right_aws'

Spec::Runner.configure do |config|
  config.use_transactional_fixtures = true
  config.use_instantiated_fixtures  = false
  config.fixture_path = RAILS_ROOT + '/spec/fixtures/'

  config.include(EmailSpec::Helpers)
  config.include(EmailSpec::Matchers)

  config.include(Authlogic::TestCase)

  config.before(:all) do
    FileUtils.mkdir_p File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures')

    ENV['TMPDIR'] = File.join(RAILS_ROOT, 'spec', 'tmp')
  end

  config.before(:each) do
    # Right AWS mocks
    TEST_S3_CONNECTION = (ENV['TEST_S3_CONNECTION'] ? true : false) unless Object.const_defined?('TEST_S3_CONNECTION')
    unless TEST_S3_CONNECTION
      @mock_s3 = AppMocks::RightAws::S3.new
      RightAws::S3.stub!(:new).and_return(@mock_s3)
    end
  end

  config.after(:each) do
    # Remove temporary fixtures files
    Dir[File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures', '*')].each do |file|
      FileUtils.rm_rf file
    end
  end

  config.after(:all) do
    # Remove all keys on S3 test bucket
    if TEST_S3_CONNECTION
      s3_config = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]
      Storage::S3::Configuration.config(s3_config).bucket.clear
    end
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

# Create an Uploaded UBZ file
def mock_uploaded_ubz(file, uuid = nil)
  ActionController::TestUploadedFile.new(fixture_file(file, uuid))
end

# Copy file in temporary folder and, if is a UBZ file, genereate an UUID.
def fixture_file(source, uuid = nil)
  @uuid_generator ||= UUID.new

  source = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', source) if source !~ /^\//

  if source =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.ubz$/
    uuid ||= @uuid_generator.generate
    target = File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures', uuid + File.extname(source))

    FileUtils.cp source, target
    begin
      Zip::ZipFile.open(target) do |content|
        content.rename("#{File.basename(source, File.extname(source))}.ub", "#{uuid}.ub")
      end
    rescue
    end
  else
    target = File.join(RAILS_ROOT, 'spec', 'tmp', 'fixtures', File.basename(source))

    FileUtils.cp source, target
  end

  target
end
