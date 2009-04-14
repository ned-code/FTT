# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_account_session, :current_account

  layout 'default'

  filter_parameter_logging :password, :password_confirmation

  private

    def current_account_session
      @current_account_session ||= AccountSession.find
    end

    def current_account
      @current_account ||= current_account_session && current_account_session.account
    end

    def reset_current_account_session
      @current_account_session.destroy if @current_account_session
      @current_account = @current_account_session = nil
    end
end
