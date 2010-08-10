class FriendshipsController < ApplicationController
  before_filter :authenticate_user!
  def index
    @user = current_user
  end
  
  #create a new friendship
  def become_friend
    Friendship.create_friendship!(current_user.id, params[:friend_id])
    render :json => {}
  end
  
  #accept a friend request
  def accept
    friendship = current_user.pending_request_friendships.where(:friend_id => params[:friend_id]).first
    friendship.accept!
    render :json => {}
  end
  
  #reject a friend request
  def reject
    friendship = current_user.pending_request_friendships.where(:friend_id => params[:friend_id]).first
    friendship.reject!
    render :json => {}
  end
  
  def cancel_request
    friendship = current_user.requested_friendships.where(:friend_id => params[:friend_id]).first
    friendship.reject!
    render :json => {}
  end
  
  #Curenttly unused
  #block a friend 
  def block
    friendship = current_user.friendships.where(:friend_id => params[:friend_id]).first
    friendship.block!
    render :json => {}
  end
  
  #
  def revoke
    friendship = current_user.friendships.where(:friend_id => params[:friend_id]).first
    friendship.revoke!
    render :json => {}
  end
end
