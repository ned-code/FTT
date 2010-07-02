# Settings specified here will take precedence over those in config/environment.rb

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
config.action_controller.perform_caching             = true
config.action_view.cache_template_loading            = true

# See everything in the log (default is :info)
# config.log_level = :debug

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Use a different cache store in production
config.cache_store = :mem_cache_store

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host = "http://assets.example.com"

# Disable delivery errors, bad email addresses will be ignored
# config.action_mailer.raise_delivery_errors = false
config.action_mailer.smtp_settings = {
  :address => 'localhost',
  :domain => 'mail.webdoc.com',
  :enable_starttls_auto => false
}
config.action_mailer.default_url_options = { :host => 'alpha.webdoc.com' }

config.logger = Logger.new("#{RAILS_ROOT}/log/#{ENV['RAILS_ENV']}.log", 50, 5242880)

#ExceptionNotification config
ExceptionNotification::Notifier.view_paths = ActionView::Base.process_view_paths(ExceptionNotification::Notifier.view_paths)
ExceptionNotification::Notifier.sender_address = %("WebDoc Alpha Error" <alpha.error@webdoc.com>)
ExceptionNotification::Notifier.email_prefix = "[WebDoc Alpha]"
ExceptionNotification::Notifier.exception_recipients = %w(alpha.error@webdoc.com)

# Enable threaded mode
# config.threadsafe!
