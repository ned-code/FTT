require 'fileutils'

namespace :myuniboard do
  namespace :dev do
    desc "Bootstrap developement environment"
    task :bootstrap do
      FileUtils.cp File.join(RAILS_ROOT, 'config', 'database.yml.default'),  File.join(RAILS_ROOT, 'config', 'database.yml')
      puts `RAILS_ENV="test" rake gems:install`
    end
  end
end