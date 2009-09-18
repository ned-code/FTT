class ApplicationController < ActionController::Base
  include AuthenticatedSystem

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
    
end