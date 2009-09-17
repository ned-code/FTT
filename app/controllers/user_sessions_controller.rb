class UserSessionsController < ApplicationController
  
  # GET /login
  def new
    @user_session = UserSession.new
  end
  
  # POST /user_sessions
  def create
    @user_session = UserSession.new(params[:user_session])

    respond_to do |format|
      if @user_session.save
        format.html do
          flash[:notice] = I18n.t 'flash.notice.login_successfull'
          redirect_back_or_default
        end
        format.xml { head :ok }
      else
        format.html { render :action => :new }
        format.xml { head :unprocessable_entity }
      end
    end
  end
  
  # GET /logout
  def destroy
    logout

    respond_to do |format|
      format.html do
        flash[:notice] = I18n.t 'flash.notice.logout_successfull'
        redirect_back_or_default login_url
      end
      format.xml { head :ok }
    end
  end

end