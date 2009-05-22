class PasswordResetsController < ApplicationController

  def new
    respond_to do |format|
      format.html
    end
  end

  def create
    @user = User.find_by_email(params[:email])

    @user.deliver_password_reset_email! if @user

    flash[:notice] = I18n.t 'flash.notice.user_password_reset_email_sent'
    respond_to do |format|
      format.html { redirect_to(new_session_url) }
      format.xml  { head :ok }
    end
  end

end
