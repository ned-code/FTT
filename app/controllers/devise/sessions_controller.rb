class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers
  
  before_filter :require_no_authentication, :only => [ :new, :create ]
  
  # GET /user
  def show
    render :json => current_user ? current_user.to_social_panel_json(current_user) : "{}"
  end
  
  # GET /resource/sign_in
  def new
    # Devise::FLASH_MESSAGES.each do |message|
    #   set_flash_message :alert, message if params.try(:[], message) == "true"
    # end
    # redirect_to root_path
    clean_up_passwords(build_resource)
    redirect_to root_path
  end
  
  # POST /resource/sign_in
  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "new")
    set_flash_message :notice, :signed_in
    sign_in_and_redirect(resource_name, resource)

    # TODO Rails3 
    # if @user = authenticate(:user)
    #   set_flash_message :notice, :signed_in
    #   sign_in(@user)
    #   redirect_to get_return_to('document') || root_path
    # else
    #   set_now_flash_message :alert, warden.message || :invalid
    #   @user = User.new
    #   @top_documents = Document.not_deleted_public_paginated_with_explore_params("recent", "all", nil, 4)
    #   render 'home/show'
    # end
  end
  
  # GET /resource/sign_out
  def destroy
    set_flash_message :notice, :signed_out if user_signed_in?
    sign_out_and_redirect(:user)
  end
  
end