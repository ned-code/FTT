require 'fileutils'

namespace :myuniboard do
  
  desc "Bootstrap application"
  task :bootstrap => :environment do
    User.create!(:email => 'admin@test.com', :password => 'test', :password_confirmation => 'test')
  end

  namespace :dev do
    desc "Bootstrap developement environment"
    task :bootstrap do
      FileUtils.cp File.join(RAILS_ROOT, 'config', 'database.yml.default'),  File.join(RAILS_ROOT, 'config', 'database.yml')
      puts `RAILS_ENV="test" rake gems:install`
    end
  end
end