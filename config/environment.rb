# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.5' unless defined? RAILS_GEM_VERSION
 
# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  # Settings in config/environments/* take precedence over those specified here.
  # Application configuration should go into files in config/initializers
  # -- all .rb files in that directory are automatically loaded.
  
  # Add additional load paths for your own custom dirs
  config.load_paths += %W( #{Rails.root}/app/observers )
  
  # Specify gems that this application depends on and have them installed with rake gems:install
  # config.gem "bj"
  # config.gem "hpricot", :version => '0.6'
  
  # Rails 3 OK
  # config.gem "sqlite3-ruby", :lib => "sqlite3"
  # config.gem 'haml'
  # config.gem 'i18n'
  # config.gem 'mime-types', :lib => 'mime/types'
  # config.gem 'json'
  # config.gem 'rubyzip', :lib => 'zip/zip'
  # config.gem 'xmpp4r'
  # config.gem 'right_aws'
  # config.gem 'warden'
  # config.gem 'devise'
  # config.gem 'will_paginate'
  # config.gem 'uuidtools' # for has_uuid plugin
  # config.gem 'uuid'
  
  # Rails 3 Maybe
  # config.gem 'carrierwave'
  # config.gem 'mini_magick'
  # config.gem 'acl9'
  # config.gem 'formtastic'
  # config.gem 'erubis'
  # Rails 3 ARG
  # config.gem 'jammit' # use plugin for the moment
  # config.gem 'formtastic'
  # config.gem "validation_reflection"
  
  # Only load the plugins named here, in the order given (default is alphabetical).
  # :all can be used as a placeholder for all plugins not explicitly named
  # config.plugins = [ :exception_notification, :ssl_requirement, :all ]
  
  # Skip frameworks you're not going to use. To use Rails without a database,
  # you must remove the Active Record framework.
  # config.frameworks -= [ :active_record, :active_resource, :action_mailer ]
  
  # Activate observers that should always be running
  config.active_record.observers = :xmpp_page_observer, :xmpp_item_observer, :xmpp_document_observer
  
  # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
  # Run "rake -D time" for a list of tasks for finding time zone names.
  config.time_zone = 'UTC'
  
  # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
  # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}')]
  # config.i18n.default_locale = :de
end