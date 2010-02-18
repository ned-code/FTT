require 'rubygems'
require 'spork'

ENV["RAILS_ENV"] = "test"

Spork.prefork do
  require File.dirname(__FILE__) + "/../config/environment"
  
  # require 'spec'
  require 'spec/rails'
  require 'remarkable_rails'
  require "email_spec"
  
  require 'factory_girl'
  require 'spec/factory_girl' # yannlugrin-rspec-factory-girl
  
  require 'fileutils'
  require 'zip/zipfilesystem'
  
  # Mocks
  require 'spec/mocks/right_aws'
  
  # Integration
  require 'webrat'
  require 'webrat/integrations/rspec-rails'
end

Spork.each_run do
  # This code will be run each time you run your specs.
  
  # Require factories file
  require File.dirname(__FILE__) + "/factories"
  # Spec Helpers
  Dir[File.join(File.dirname(__FILE__), "spec_helpers", '*.rb')].each { |file| require file }
  
  # make sure that the db connection is ready.
  ActiveRecord::Base.establish_connection
  
  Spec::Runner.configure do |config|
    config.use_transactional_fixtures = true
    config.use_instantiated_fixtures  = false
    config.fixture_path = RAILS_ROOT + '/spec/fixtures/'
    
    config.include(EmailSpec::Helpers)
    config.include(EmailSpec::Matchers)
    
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
 
      @credentials = ActionController::HttpAuthentication::Basic.encode_credentials("webdoc", "_wcwebdoc10")
      if (@controller != nil)
        @controller.request.env['HTTP_AUTHORIZATION'] = @credentials
      end

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
  
  # Integration
  Webrat.configure do |config|
    config.mode = :rails
    config.open_error_files = false
  end
  
end