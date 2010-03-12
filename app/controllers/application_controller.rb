class ApplicationController < ActionController::Base
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  rescue_from Acl9::AccessDenied, :with => :forbidden_access
  
  before_filter :http_authenticate
  before_filter :set_xmpp_client_id_in_thread
  before_filter  :set_current_user_in_thread 
  
  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
  
protected
  
  def forbidden_access
    render_optional_error_file(:not_found)
    # render :status => :forbidden
  end
  
  def http_authenticate
    if (Rails.env.production? || Rails.env.staging?) 
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
  
  def set_current_user_in_thread
    Thread.current[:user] = current_user
  end
  
  def document_is_public?
    @document && @document.is_public?
  end
  
end