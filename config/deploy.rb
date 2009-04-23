# This is a sample Capistrano config file for EC2 on Rails.
# It should be edited and customized.

set :application, "uniboard"

set :stages, %w(production staging)
set :default_stage, "staging"
require 'capistrano/ext/multistage'

set :scm, :git
set :repository, "git@git.assembla.com:myuniboard.git"
set :git_shallow_clone, 1
set :short_branch, "master"
set :ssh_options, { :forward_agent => true }

# NOTE: for some reason Capistrano requires you to have both the public and
# the private key in the same folder, the public key should have the 
# extension ".pub".
ssh_options[:keys] = ["#{ENV['HOME']}/.ssh/ec2-mnemis"]

# EC2 on Rails config. c
# NOTE: Some of these should be omitted if not needed.
set :ec2onrails_config, {
  # S3 bucket and "subdir" used by the ec2onrails:db:restore task
  # NOTE: this only applies if you are not using EBS
  :restore_from_bucket => "uniboard-staging",
  :restore_from_bucket_subdir => "database",
  
  # S3 bucket and "subdir" used by the ec2onrails:db:archive task
  # This does not affect the automatic backup of your MySQL db to S3, it's
  # just for manually archiving a db snapshot to a different bucket if 
  # desired.
  # NOTE: this only applies if you are not using EBS
  :archive_to_bucket => "uniboard-staging",
  :archive_to_bucket_subdir => "database-archive/#{Time.new.strftime('%Y-%m-%d--%H-%M-%S')}",
  
  # Set a root password for MySQL. Run "cap ec2onrails:db:set_root_password"
  # to enable this. This is optional, and after doing this the
  # ec2onrails:db:drop task won't work, but be aware that MySQL accepts 
  # connections on the public network interface (you should block the MySQL
  # port with the firewall anyway). 
  # If you don't care about setting the mysql root password then remove this.
  :mysql_root_password => "_ub123",
  
  # Any extra Ubuntu packages to install if desired
  # If you don't want to install extra packages then remove this.
  :packages => ["logwatch"],
  
  # Any extra RubyGems to install if desired: can be "gemname" or if a 
  # particular version is desired "gemname -v 1.0.1"
  # If you don't want to install extra rubygems then remove this
  # NOTE: if you are using rails 2.1, ec2onrails calls 'sudo rake gem:install',
  # which will install gems defined in your rails configuration
  :rubygems => [],
  
  # extra security measures are taken if this is true, BUT it makes initial
  # experimentation and setup a bit tricky.  For example, if you do not
  # have your ssh keys setup correctly, you will be locked out of your
  # server after 3 attempts for upto 3 months.  
  :harden_server => false,
  
  # if you want to harden the server, or setup email signing, you will need to set the domain
  # if you use Capistrano's multistage extension (recommended!), you can add a line like this to your
  # environment specific file:
  #      ec2onrails_config[:service_domain] = 'staging.mydomain.com'
  :service_domain => nil,
  
  # Set the server timezone. run "cap -e ec2onrails:server:set_timezone" for 
  # details
  :timezone => "UTC",
  
  # Files to deploy to the server (they'll be owned by root). It's intended
  # mainly for customized config files for new packages installed via the 
  # ec2onrails:server:install_packages task. Subdirectories and files inside
  # here will be placed in the same structure relative to the root of the
  # server's filesystem. 
  # If you don't need to deploy customized config files to the server then
  # remove this.
  :server_config_files_root => "./config/server_configs",
  
  # If config files are deployed, some services might need to be restarted.
  # If you don't need to deploy customized config files to the server then
  # remove this.
  :services_to_restart => %w(postfix sysklogd),
  
  # Set an email address to forward admin mail messages to. If you don't
  # want to receive mail from the server (e.g. monit alert messages) then
  # remove this.
  :mail_forward_address => "yann.lugrin@liquid-concept.ch",
  
  # Set this if you want SSL to be enabled on the web server. The SSL cert 
  # and key files need to exist on the server, The cert file should be in
  # /etc/ssl/certs/default.pem and the key file should be in
  # /etc/ssl/private/default.key (see :server_config_files_root).
  :enable_ssl => true
}

after "deploy:finalize_update" do
  run "ln -nsf #{release_path}/config/database.default.yml #{release_path}/config/database.yml"
  run "cd #{release_path}; sudo rake gems:install"
end
