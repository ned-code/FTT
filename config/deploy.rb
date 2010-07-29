set :application, "webdoc"

set :stages, %w(production staging staging_big)
set :default_stage, "staging"
require 'capistrano/ext/multistage'

set :user, "webdoc"
set :runner, "webdoc"
set :use_sudo, false

default_run_options[:pty] = true
set :scm, :git
set :repository, "git@git.assembla.com:webdoc"
ssh_options[:forward_agent] = true

after 'deploy:update_code', 'deploy:bundle_install', 'deploy:generate_assets', 'deploy:link_config', 'deploy:update_crontab'

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
  task :bundle_install do
    run "cd #{release_path} && #{ruby_path}/bin/bundle install --without test"
  end
  task :link_config do
    run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
    run "ln -nfs #{shared_path}/config/allowed_user_email.yml #{release_path}/config/allowed_user_email.yml"
    run "ln -nfs #{shared_path}/config/s3.yml #{release_path}/config/s3.yml"
    run "ln -nfs #{shared_path}/config/config.yml #{release_path}/config/config.yml"
    run "ln -nfs #{shared_path}/config/newrelic.yml #{release_path}/config/newrelic.yml"
    run "ln -nfs #{shared_path}/reports/analytics.csv #{release_path}/reports/analytics.csv"
  end
  task :generate_assets do
    send(:run, "cd #{release_path} && RAILS_ENV=#{rails_env} #{ruby_path}/bin/jammit --force config/assets.yml")
  end
  task :show_maintenance do
    run "cp #{current_path}/app/views/layouts/maintenance.html #{current_path}/public/maintenance.html"
  end
  task :hide_maintenance do
    run "rm #{current_path}/public/maintenance.html"
  end
  task :update_crontab, :roles => :app do
    run "cd #{release_path} && #{ruby_path}/bin/whenever --set environment=#{rails_env} --update-crontab #{application}"
  end
end

namespace :passenger do
  desc "passenger memory stats"
  task :memory, :roles => :app do
    run "passenger-memory-stats" do |channel, stream, data|
      puts data
    end
  end
  desc "passenger general info"
  task :general, :roles => :app do
    run "sudo passenger-status"
  end
end

namespace :newrelic do
  desc "start newrelic agent (! it's restart the application"
  task :activate, :roles => :app do
    run "ln -nfs #{shared_path}/config/newrelic-activated.yml #{shared_path}/config/newrelic.yml"
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
  desc "stop newrelic agent (! it's restart the application"
  after 'newrelic:stop', 'deploy:restart'  
  task :disable, :roles => :app do
    run "ln -nfs #{shared_path}/config/newrelic-disabled.yml #{shared_path}/config/newrelic.yml"
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end
                                 
task :uname do
  run "uname -a"
end

