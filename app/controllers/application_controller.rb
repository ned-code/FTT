class ApplicationController < ActionController::Base
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_user_session, :current_user

  layout 'default'

  filter_parameter_logging :password, :password_confirmation

  protected

    def current_user_session
      @current_user_session ||= UserSession.find
    end

    def current_user
      @current_user ||= current_user_session && current_user_session.user
    end

    def destroy_current_user_session
      current_user_session.destroy if current_user_session
      @current_user = @current_user_session = nil
    end
    
    def store_location
      session[:return_to] = request.request_uri
    end

    def redirect_back_or_default(default)
      redirect_to(session[:return_to] || default)
      session[:return_to] = nil
    end
end
