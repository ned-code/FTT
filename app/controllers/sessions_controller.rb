class SessionsController < ApplicationController
  def new
    @account_session = AccountSession.new
  end

  def create
    @account_session = AccountSession.new(params[:account_session])
    if @account_session.save
      flash[:notice] = I18n.t 'flash.notice.login_successfull'
      redirect_back_or_default account_url
    else
      render :action => :new
    end
  end

  def destroy
    reset_current_account_session
    flash[:notice] = I18n.t 'flash.notice.logout_successfull'
    redirect_back_or_default new_user_session_url
  end
end
