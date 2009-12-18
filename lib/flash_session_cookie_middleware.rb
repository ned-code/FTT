# a rack middleware to intercept traffic from Flash (used for swfupload)
# See http://jetpackweb.com/blog/2009/10/21/rails-2-3-4-and-swfupload-rack-middleware-for-flash-uploads-that-degrade-gracefully

require 'rack/utils'

class FlashSessionCookieMiddleware
  def initialize(app, session_key = '_session_id')
    @app = app
    @session_key = session_key
  end

  def call(env)
    if env['HTTP_USER_AGENT'] =~ /^(Adobe|Shockwave) Flash/
      params = ::Rack::Request.new(env).params
      env['HTTP_COOKIE'] = [ @session_key, params[@session_key] ].join('=').freeze unless params[@session_key].nil?
    end
    @app.call(env)
  end
end
