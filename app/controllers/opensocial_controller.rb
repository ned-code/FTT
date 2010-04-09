
require 'opensocial/person_service'


class OpensocialController < ApplicationController
  
  # GET /opensocial/person/:id
  def person
    @user = PersonService.person(params[:id], params[:security_token])

    render :json => @user.to_json(:only => [:id, :email, :username, :first_name, :last_name, :bio, :gender, :website], :methods => [:avatar_thumb_url])
  end

  # GET /opensocial/friends/:id
  def friends
    @users = PersonService.friends(params[:id], params[:security_token])

    render :json => @users.to_json(:only => [:id, :email, :username, :first_name, :last_name, :bio, :gender, :website], :methods => [:avatar_thumb_url])
  end

end
