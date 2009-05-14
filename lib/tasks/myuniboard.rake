require 'fileutils'

desc 'Special task for runnig tests on Integrity server'
task :integrity do
  cp 'config/database.default.yml', 'config/database.yml'
  cp 'config/s3.default.yml', 'config/s3.yml'

  Rake::Task['db:migrate:reset'].invoke
  Rake::Task['spec'].invoke
  Rake::Task['features'].invoke
end

namespace :myuniboard do
  
  desc "Bootstrap application"
  task :bootstrap => :environment do
    user = User.create!(:email => 'admin@test.com', :password => 'test', :password_confirmation => 'test')
    user.confirm!
    user.is_administrator
  end

  namespace :dev do
    desc "Bootstrap developement environment"
    task :bootstrap do
      FileUtils.cp File.join(RAILS_ROOT, 'config', 'database.default.yml'),  File.join(RAILS_ROOT, 'config', 'database.yml')
      FileUtils.cp File.join(RAILS_ROOT, 'config', 's3.default.yml'),  File.join(RAILS_ROOT, 'config', 's3.yml')      
      puts `RAILS_ENV="test" rake gems:install`
    end
  end
end