class FriendshipsController < ApplicationController
  before_filter :authenticate_user!
  def index
    @friends = current_user.friends
    
    #TODO: pagination
    render :json => { 
      :friends => @friends,
      :pagination => {
        :per_page => "",
        :current_page => "",
        :total_pages => "", 
        :next_page => "",
        :previous_page => "",
        :total => ""
      }
    }
  end
  
  #create a new friendship
  def become_friend
    friend = User.where(:uuid => params[:friend_id]).first
    Friendship.create_friendship!(current_user,friend)
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
