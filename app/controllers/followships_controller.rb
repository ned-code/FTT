class FollowshipsController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /following
  def following
    render :json => current_user.following.to_json(:only => [:id, :username, :bio], :methods => [:avatar_thumb_url, :documents_count])
  end
  
  # GET /followers
  def followers
    render :json => current_user.followers.to_json(:only => [:id, :username, :bio], :methods => [:avatar_thumb_url, :documents_count])
  end
  
  # POST /followships/follow
  def create
    current_user.follow(params[:following_id])
    render :json => {}
  end
  
  # DELETE /followships/unfollow
  def destroy
   current_user.unfollow(params[:following_id])
   render :json => {}
  end
  
end