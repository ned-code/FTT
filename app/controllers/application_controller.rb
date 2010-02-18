class ApplicationController < ActionController::Base
  
  before_filter :http_authenticate
  before_filter :set_xmpp_client_id_in_thread
  
  include AuthenticatedSystem
  rescue_from Acl9::AccessDenied, :with => :deny_access
  
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  
  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
  
protected
  
  def deny_access
    render_optional_error_file(:not_found)
  end 
  
  def global_user
    @global_user ||= User.find_by_username("all")
  end
  
  def public_document?
    public_read_document? || public_edit_document?
  end
  
  def public_read_document?
    global_user.has_role?("reader",@document)
  end
  
  def public_edit_document?
    global_user.has_role?("editor",@document)
  end  
  
  def http_authenticate
    if Rails.env.production?
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
    
end