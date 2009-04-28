# This file is copied to ~/spec when you run 'ruby script/generate rspec'
# from the project root directory.
ENV["RAILS_ENV"] = "test"
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
require 'spec/autorun'
require 'spec/rails'
require "email_spec/helpers"
require "email_spec/matchers"
require 'fileutils'

Spec::Runner.configure do |config|
  # If you're not using ActiveRecord you should remove these
  # lines, delete config/database.yml and disable :active_record
  # in your config/boot.rb
  config.use_transactional_fixtures = true
  config.use_instantiated_fixtures  = false
  config.fixture_path = RAILS_ROOT + '/spec/fixtures/'

  config.include(EmailSpec::Helpers)
  config.include(EmailSpec::Matchers)

  config.include(Authlogic::TestCase)

  config.before(:all) do
    @s3_config = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]

    FileUtils.mkdir_p File.join(RAILS_ROOT, 'spec', 'tmp', 'files')
  end

  config.before(:each) do
    AWS::S3::Base.stub!(:connected?).and_return(true)
    AWS::S3::Base.stub!(:establish_connection!).and_return(true)
    AWS::S3::Bucket.stub!(:objects).and_return([])
    AWS::S3::S3Object.stub!(:delete).and_return(true)
    AWS::S3::S3Object.stub!(:store).and_return(true)
    AWS::S3::S3Object.stub!(:url_for).and_return('http://amazon') # TODO: Dynamic result with realistic path to page
    AWS::S3::Bucket.stub!(:list).and_return([])
    AWS::S3::Bucket.stub!(:create).and_return(true)
  end

  config.after(:each) do
    Dir[File.join(RAILS_ROOT, 'spec', 'tmp', 'files', '*')].each do |file|
      FileUtils.rm file
    end
  end

  # == Fixtures
  #
  # You can declare fixtures for each example_group like this:
  #   describe "...." do
  #     fixtures :table_a, :table_b
  #
  # Alternatively, if you prefer to declare them only once, you can
  # do so right here. Just uncomment the next line and replace the fixture
  # names with your fixtures.
  #
  # config.global_fixtures = :table_a, :table_b
  #
  # If you declare global fixtures, be aware that they will be declared
  # for all of your examples, even those that don't use them.
  #
  # You can also declare which fixtures to use (for example fixtures for test/fixtures):
  #
  # config.fixture_path = RAILS_ROOT + '/spec/fixtures/'
  #
  # == Mock Framework
  #
  # RSpec uses it's own mocking framework by default. If you prefer to
  # use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  #
  # == Notes
  #
  # For more information take a look at Spec::Runner::Configuration and Spec::Runner
end

def mock_uploaded_ubz(file, uuid = nil)
  ActionController::TestUploadedFile.new(fixture_file(file, uuid))
end

def fixture_file(source, uuid = nil)
  @uuid_generator ||= UUID.new

  source = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', source) if source !~ /^\//

  if source =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.ubz$/
    uuid ||= @uuid_generator.generate
    target = File.join(RAILS_ROOT, 'spec', 'tmp', 'files', uuid + File.extname(source))

    FileUtils.cp source, target
    begin
      Zip::ZipFile.open(target) do |content|
        content.rename("#{File.basename(source, File.extname(source))}.ub", "#{uuid}.ub")
      end
    rescue
    end
  else
    target = File.join(RAILS_ROOT, 'spec', 'tmp', 'files', File.basename(source))

    FileUtils.cp source, target
  end

  target
end
