class UsersController < ApplicationController
  
  # GET /users
  def index
    @users = User.all
  end
  
  # GET /users/:id
  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @user.to_social_panel_json(current_user) }
    end
  end
  
  def favorites
    @user = current_user
    respond_to do |format|
      format.html { render :layout => false}
    end
  end

  def dashboard
    set_return_to
  end
  
end