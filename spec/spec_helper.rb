ENV["RAILS_ENV"] = "test"
require File.dirname(__FILE__) + "/../config/environment"

# Require factories file
require File.dirname(__FILE__) + "/factories"
# Spec Helpers
Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |file| require file }

Spec::Runner.configure do |config|
  config.use_transactional_fixtures = true
  config.use_instantiated_fixtures  = false
  config.fixture_path = RAILS_ROOT + '/spec/fixtures/'
end

# Integration
Webrat.configure do |config|
  config.mode = :rails
  config.open_error_files = false
end