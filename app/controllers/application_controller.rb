class ApplicationController < ActionController::Base
  include AuthenticatedSystem
  rescue_from Acl9::AccessDenied, :with => :deny_access # self defined exception

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
    
  def deny_access
    render_optional_error_file(:not_found)
  end 
    
end