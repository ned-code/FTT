class FriendshipsController < ApplicationController
  before_filter :authenticate_user!
  
  def index
    @friendships = current_user.friendships
    @requested_friendships = current_user.requested_friendships
    @pending_request_friends = current_user.pending_request_friends
  end
  
  #create a new friendship
  def create
    Friendship.create_friendship(:user_id => current_user.id, :friend_id => params[:friend_id])
  end
  
  #accept a friend request
  def accept
    current_user.pending_request_friendships.find(params[:friendship_id]).accept!
  end
  
  #reject a friend request
  def reject
    current_user.pending_request_friendships.find(params[:friendship_id]).reject!
  end
  
  #Curenttly unused
  #block a friend 
  def block
    current_user.friendships.find(params[:friendship_id]).block!
  end
  
  #
  def destroy
    current_user.friendships.find(params[:friendship_id]).revoke!
  end
end
