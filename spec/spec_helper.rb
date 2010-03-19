require 'rubygems'
require 'spork'

ENV["RAILS_ENV"] = "test"

Spork.prefork do
  require File.dirname(__FILE__) + "/../config/environment"
  
  require 'spec/rails'
  require 'remarkable_rails'
  require "email_spec"
  
  require 'factory_girl'
  require 'spec/factory_girl' # rspec-factory-girl
  
  # Integration
  require 'webrat'
  require 'webrat/integrations/rspec-rails'
end

Spork.each_run do
  # This code will be run each time you run your specs.
  
  # Require factories file
  require File.dirname(__FILE__) + "/factories"
  # Spec Helpers
  Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |file| require file }
  
  # make sure that the db connection is ready.
  ActiveRecord::Base.establish_connection
  
  Spec::Runner.configure do |config|
    config.use_transactional_fixtures = true
    config.use_instantiated_fixtures  = false
    config.fixture_path = RAILS_ROOT + '/spec/fixtures/'
    
    config.include(EmailSpec::Helpers)
    config.include(EmailSpec::Matchers)
  end
  
  # Integration
  Webrat.configure do |config|
    config.mode = :rails
    config.open_error_files = false
  end
  
end