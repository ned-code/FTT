class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:new, :create, :show]
  
  # GET /users
  def index
    @users = User.all
  end
  
  # GET /users/:id
  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @user.to_social_panel_json }
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
      redirect_to @user
    else
      render :edit
    end
  end
  
end