class Friendship < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  ACCEPTED = 'accepted'
  REQUESTED = 'requested'
  PENDING_REQUEST = 'pending_request'
  BLOCKED = 'blocked'
  
  # ================
  # = Associations =
  # ================
   
  belongs_to :user
  belongs_to :friend, :class_name => 'User', :foreign_key => 'friend_id'
  
  has_many :user_lists_friends, :dependent => :destroy
  
  # =============
  # = Callbacks =
  # =============
  
  after_create :assign_friendship_to_default_user_list
  
  # ===============
  # = Validations =
  # ===============

  validates_presence_of :user_id, :friend_id
  validates_uniqueness_of :friend_id, :scope => :user_id
  
  # =================
  # = Class Methods =
  # =================
  
  def self.create_friendship!(user, friend, with_request=true)
    if with_request
      status = REQUESTED
    else
      status = ACCEPTED
    end
    transaction do
      friendship = Friendship.create!({ :user_id => user.id, :friend_id => friend.id, :status => status })
      Friendship.create_friend_mirror!(friend.id,user.id, with_request)
    end
    if with_request
      Notifier.request_friendship(user,friend).deliver
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def accept!
    transaction do
      update_attribute(:status, Friendship::ACCEPTED )
      mirror.update_attribute(:status, Friendship::ACCEPTED )
    end
    Notifier.accept_friendship(friend,user).deliver
  end
  
  def reject!
    transaction do
      self.remove_asociated_roles 
      self.mirror.destroy
      self.destroy
    end
  end
  
  def revoke!
    transaction do
      self.remove_asociated_roles
      self.mirror.destroy
      self.destroy
    end
  end
  
  def block!
    transaction do
      update_attribute(:status, Friendship::BLOCKED )
      mirror.update_attribute(:status, Friendship::BLOCKED )
    end
  end
  
  #return the associated friendship
  def mirror
    Friendship.where(:user_id => self.friend_id, :friend_id => self.user_id).first
  end
  
  def remove_asociated_roles
    self.user_lists_friends.each do |list|
      Role.where(:user_id => self.friend_id, :user_list_id => list.id).delete_all
    end
    self.mirror.user_lists_friends.each do |list|
      Role.where(:user_id => self.mirror.friend_id, :user_list_id => list.id).delete_all
    end
  end
  
private

  def self.create_friend_mirror!(user_id, friend_id, with_request=true)
    if with_request
      status = PENDING_REQUEST
    else
      status = ACCEPTED
    end
    friendship = Friendship.create!({ :user_id => user_id, :friend_id => friend_id, :status => status})
  end
  
  def assign_friendship_to_default_user_list
    user_list = user.default_list
    UserListsFriend.create!(:user_list_id => user_list.id, :friendship_id => self.id)
  end
end

#########################
# Status lists
# - accepted
# - requested
# - pending_request
# - blocked
#