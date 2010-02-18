# include at least one source and the rails gem
source :gemcutter

gem "rails", "~> 2.3.5", :require => nil
gem "sqlite3-ruby", :require => "sqlite3"
gem 'mime-types', :require => 'mime/types'

gem 'haml'
gem 'sprockets'
gem "is_paranoid"
gem 'uuid'
gem 'rubyzip', :require => 'zip/zip'
gem 'xml-object'
gem 'hpricot'
gem 'json'
gem 'xmpp4r'
gem 'carrierwave'
gem 'mini_magick'
gem 'right_aws'
gem 'will_paginate'
gem 'devise', '1.0.2'
gem 'warden'
gem 'i18n'
gem 'formtastic'
gem "validation_reflection"
gem 'uuidtools' # for has_uuid plugin
# gem 'sprockets-rails'

group :development do
  # bundler requires these gems in development
  gem 'mongrel'
  gem 'annotate'
  gem 'rails-footnotes'
  gem 'ruby-debug'
  gem 'rack-debug'
end
 
group :test do
  # bundler requires these gems while running tests
  gem 'rspec'
  gem 'rspec', :require => nil
  gem 'rspec-rails', :require => nil
  gem 'remarkable_rails', :require => nil
  
  gem 'factory_girl', :require => nil
  gem 'rspec-factory-girl', :require => nil
  
  gem 'webrat', :require => nil
  gem 'cucumber', :require => nil
  gem 'email_spec', :require => nil
  
  gem 'spork'
end
