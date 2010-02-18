class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:new, :create]
  
  # GET /users
  def index
    @users = User.all
  end
  
  # GET /users/new
  def new
    @user = User.new
  end
  
  # GET /users/:id
  def show
    @user = User.find(params[:id])
  end
  
  # GET /users/:id/edit
  def edit
    @user = User.find(params[:id])
  end
  
  # POST /users
  def create
    @user = User.new(params[:user])
    
    if @user.save
      sign_in(@user)
      redirect_to documments_path
    else
      render :new
    end
  end
  
  # PUT /users/:id
  def update
    @user = User.find(params[:id])
    
    if @user.update_attributes(params[:user])
      redirect_to @user
    else
      render :edit
    end
  end
  
  # DELETE /users/:id
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    
    flash[:notice] = I18n.t 'flash.notice.user_destroyed'
    redirect_to users_path
  end
  
end