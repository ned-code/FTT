class ApplicationController < ActionController::Base
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  rescue_from Acl9::AccessDenied, :with => :forbidden_access
  
  include ExceptionNotification::Notifiable
  
  before_filter :http_authenticate
  before_filter :set_xmpp_client_id_in_thread

  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
  
protected
  
  def forbidden_access
    render_optional_error_file(:forbidden)
  end
  
  def http_authenticate
    if !['65.49.79.67', '86.57.245.87'].include?(request.remote_ip) && Rails.env != 'test'
      authenticate_or_request_with_http_basic do |username, password|
        username == "wduser" && password == "wdalpha001"
      end
      # Can be removed with Rails 3: http://wiki.github.com/plataformatec/devise/devise-and-http-authentication
      warden.custom_failure! if performed?
    end
  end
  
  def set_xmpp_client_id_in_thread
    Thread.current[:xmpp_client_id] = params[:xmpp_client_id]
  end
  

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def set_return_to(scope=nil)
    if scope == nil
      session[:return_to] = request.request_uri if request && request.get?
    else
      session[:"return_to_#{scope}"] = request.request_uri if request && request.get?
    end
  end

  def get_return_to(scope=nil)
    path = nil
    if scope == nil
      path = session[:return_to] || root_path
    else
      path = session[:"return_to_#{scope}"] || root_path
      session[:"return_to_#{scope}"] = nil
    end
    path
  end

  def document_is_public?      
    if (@pseudo_document)
      @pseudo_document.is_public?
    end
  end
end
