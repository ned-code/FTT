# Be sure to restart your server when you modify this file.

Webdoc::Application.config.session_store :cookie_store, :key => '_webdoc_session'

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# Webdoc::Application.config.session_store :active_record_store

# See http://jetpackweb.com/blog/2009/10/21/rails-2-3-4-and-swfupload-rack-middleware-for-flash-uploads-that-degrade-gracefully
Webdoc::Application.config.middleware.insert_before(
  Webdoc::Application.config.session_store,
  FlashSessionCookieMiddleware,
  Webdoc::Application.config.session_options[:key]
)
