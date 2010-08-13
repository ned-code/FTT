class FollowshipsController < ApplicationController
  
  # GET /followships
  def index
    @user = current_user
  end
  
  # POST /followships/follow
  def follow
    current_user.follow(params[:following_id])
    render :json => {}
  end
  
  # DELETE /followships/unfollow
  def unfollow
    current_user.unfollow(params[:following_id])
    render :json => {}
  end
  
end