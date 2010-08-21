class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  skip_before_filter :verify_authenticity_token, :only => [:create]
  skip_before_filter :http_authenticate, :only => [:create]

  before_filter :require_no_authentication, :only => [ :new, :create ]
  
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
    if params[:app_id].present?
      if Token::ALLOWED_APPLICATION_IDS.include? params[:app_id]
        user = User.where(['users.email = ?', params['email']]).first
        if user.present? && user.valid_password?(params['password'])
          token = Token.create_or_update!(user.uuid, params[:app_id])
          render :json => { :user_token => token.token }
        else
          render :json => {}, :status => 403
        end

      else
        render :json => {}, :status => 403
      end
    else
      verify_authenticity_token
      http_authenticate
      resource = warden.authenticate!(:scope => resource_name, :recall => "new")
      set_flash_message :notice, :signed_in
      
      invitation = Invitation.pending.where(:uuid => params[:invitation]).first
      if invitation.present?
        sign_in(resource_name, resource)
        invitation.accept!(current_user)
        if invitation.document.present?
          redirect_to document_path(invitation.document)
        else
          redirect_to root_path
        end
      else
        sign_in_and_redirect(resource_name, resource)
      end      
    end

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
