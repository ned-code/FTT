class SessionsController < ApplicationController
  def new
    @account_session = AccountSession.new
  end

  def create
    @account_session = AccountSession.new(params[:account_session])
    respond_to do |format|
      if @account_session.save
        format.html do
          flash[:notice] = I18n.t 'flash.notice.login_successfull'
          redirect_back_or_default account_url
        end
        format.xml { head :login_successfull }
      else
        format.html { render :action => :new }
        format.xml { head :login_failed }
      end
    end
  end

  def destroy
    reset_current_account_session
    respond_to do |format|
      format.html do
        flash[:notice] = I18n.t 'flash.notice.logout_successfull'
        redirect_back_or_default new_user_session_url
      end
      format.xml { head :logout_successfull }
    end
  end
end