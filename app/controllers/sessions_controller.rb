class SessionsController < ApplicationController
  def new
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(params[:user_session])
    respond_to do |format|
      if @user_session.save
        format.html do
          flash[:notice] = I18n.t 'flash.notice.login_successfull'
          redirect_back_or_default users_url
        end
        format.xml { head :login_successfull }
      else
        format.html { render :action => :new }
        format.xml { head :login_failed }
      end
    end
  end

  def destroy
    reset_current_user_session
    respond_to do |format|
      format.html do
        flash[:notice] = I18n.t 'flash.notice.logout_successfull'
        redirect_back_or_default new_user_session_url
      end
      format.xml { head :logout_successfull }
    end
  end
end