class UsersController < ApplicationController
  permit 'owner or administrator', :only => [:show, :edit, :update, :destroy]
  permit 'administrator', :only => [:index]

  def index
    @users = User.all
    respond_to do |format|
      format.html
      format.xml { render :xml => @users }
    end
  end

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
      format.xml { render :xml => @user }
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        @user.deliver_email_confirmation!
        
        format.html do
          flash[:notice] = I18n.t 'flash.notice.user_registred'
          redirect_to users_url
        end
        format.xml  { render :xml => @user, :status => :created, :location => @user }
      else
        format.html { render :action => 'new' }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  def confirm
    @user = User.find_using_perishable_token(params[:id])

    if @user and @user.activate!
      reset_session
      UserSession.create(@user)

      flash[:notice] = I18n.t 'flash.notice.user_confirmed'
      redirect_to users_url
    else
      flash[:notice] = I18n.t 'flash.notice.not_find_user_by_perishable_token'
      redirect_to new_session_url
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html do
          flash[:notice] = I18n.t 'flash.notice.user_updated'
          redirect_to users_url
        end
        format.xml  { head :ok }
      else
        format.html { render :action => 'edit '}
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html do
        flash[:notice] = I18n.t 'flash.notice.user_destroyed'
        redirect_to users_url
      end
      format.xml { head :user_destroyed }
    end
  end
end
