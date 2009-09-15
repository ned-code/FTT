class UsersController < ApplicationController
  permit 'registered', :except => [:new, :create, :confirm, :change_password]
  permit 'administrator', :only => [:index]

  def index
    @users = User.all

    respond_to do |format|
      format.html
    end
  end

  def show
    @user = User.find(params[:id])

    if @user == current_user || permit?('administrator')

      respond_to do |format|
        format.html
      end

    else
      handle_redirection
    end
  end

  def new
    @user = User.new

    respond_to do |format|
      format.html { render :new }
    end
  end

  def create
    @user = User.new(params[:user])
    
    respond_to do |format|
      if @user.save_without_session_maintenance
        if current_user && current_user.is_administrator?
          @user.confirm!
          @user.deliver_registration_confirmation_email!
        else
          @user.deliver_registration_activation_email!
        end
        
        format.html do
          if current_user && current_user.is_administrator?
            flash[:notice] = I18n.t 'flash.notice.user_registered'
            redirect_to users_url
          else
            flash[:notice] = I18n.t 'flash.notice.user_registered'
            redirect_to root_url
          end
        end
      else
        format.html { render :action => 'new' }
      end
    end
  end

  def confirm
    @user = User.find_using_perishable_token(params[:id])

    respond_to do |format|
      format.html do

        if @user and @user.confirm!
          @user.deliver_registration_confirmation_email!

          reset_session
          UserSession.create(@user)

          flash[:notice] = I18n.t 'flash.notice.user_confirmed'
          redirect_to root_url
        else
          flash[:notice] = I18n.t 'flash.notice.not_find_user_by_perishable_token'
          redirect_to new_session_url
        end

      end
    end
  end

  def edit
    @user = User.find(params[:id])

    if @user == current_user || permit?('administrator')

      respond_to do |format|
        format.html { render :action => 'edit' }
      end

    else
      handle_redirection
    end
  end

  def change_password
    @user = User.find_using_perishable_token(params[:id])

    respond_to do |format|
      if @user
        UserSession.create(@user)
        format.html
      else
        flash[:notice] = I18n.t 'flash.notice.not_find_user_by_perishable_token'
        format.html { redirect_to(new_session_url)}
      end
    end
  end

  def update
    @user = User.find(params[:id])

    if @user == current_user || permit?('administrator')
      respond_to do |format|

        if @user.update_attributes(params[:user])
          format.html do
            flash[:notice] = I18n.t 'flash.notice.user_updated'
            redirect_to edit_user_url(@user)
          end
        else
          format.html { render :action => 'edit '}
        end

      end
    else
      handle_redirection
    end
  end

  def destroy
    @user = User.find(params[:id])

    if @user == current_user || permit?('administrator')
      respond_to do |format|

        @user.destroy

        format.html do
          if current_user.is_administrator?
            flash[:notice] = I18n.t 'flash.notice.user_destroyed'
            redirect_to users_url
          else
            flash[:notice] = I18n.t 'flash.notice.user_destroyed'
            redirect_to root_url
          end
        end

      end
    else
      handle_redirection
    end
  end
end
