# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_myuniboard_gen_session',
  :secret      => '5ae417a0ef949425278ef444e1b23076b6bb2afca8f5ee8067d0bc7b65937e03f74f3366802280526dd3888db607a2c122aaf025c09ea40c8fd7fd95c4a6fb84'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

# See http://jetpackweb.com/blog/2009/10/21/rails-2-3-4-and-swfupload-rack-middleware-for-flash-uploads-that-degrade-gracefully
ActionController::Dispatcher.middleware.insert_before(ActionController::Base.session_store, FlashSessionCookieMiddleware, ActionController::Base.session_options[:key])
