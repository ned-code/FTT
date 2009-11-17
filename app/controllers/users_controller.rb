class UsersController < ApplicationController
  before_filter :login_required
  access_control do
    allow :admin
  end  
  
  # GET /users
  def index
    @users = User.all

    respond_to do |format|
      format.html
    end
  end
  
  # GET /signup
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
      UserSession.create(@user) # login
      redirect_back_or_default
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