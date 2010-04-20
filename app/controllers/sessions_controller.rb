class SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers
  
  before_filter :require_no_authentication, :only => [ :new, :create ]
  
  # GET /user
  def show
    render :json => current_user ? current_user.to_json(:only => [:id, :username, :uuid]) : "{}"
  end
  
  # GET /resource/sign_in
  def new
    Devise::FLASH_MESSAGES.each do |message|
      set_flash_message :alert, message if params.try(:[], message) == "true"
    end
    redirect_to root_path
  end
  
  # POST /resource/sign_in
  def create
    if @user = authenticate(:user)
      set_flash_message :notice, :signed_in
      sign_in(@user)
      redirect_to root_path
    else
      set_now_flash_message :alert, warden.message || :invalid
      @user = User.new
      @top_documents = Document.all_public_paginated_with_explore_params("recent", "all", nil, 4)
      render 'home/show'
    end
  end
  
  # GET /resource/sign_out
  def destroy
    set_flash_message :notice, :signed_out if user_signed_in?
    sign_out_and_redirect(:user)
  end
  
end
