class UsersController < ApplicationController

  access_control do
    allow logged_in, :except => [:index]
    allow :admin, :to => [:index]
  end
  
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
  
  # GET /users/:id/edit
  def edit
    @user = current_user
  end
  
  # PUT /users/:id
  def update
    @user = current_user

    if @user.update_attributes(params[:user])
      flash[:notice] = t('flash.notice.users.edit_successful')
      redirect_to edit_user_path(@user)
    else
      render :edit
    end
  end
  
end