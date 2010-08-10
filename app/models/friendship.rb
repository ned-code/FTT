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
  
  def self.create_friendship!(user_id, friend_id)
    transaction do
      friendship = Friendship.create!({ :user_id => user_id, :friend_id => friend_id, :status => Friendship::REQUESTED })
      Friendship.create_friend_mirror!(friend_id,user_id)
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
  end
  
  def reject!
    transaction do
      self.mirror.destroy
      self.destroy
    end
  end
  
  def revoke!
    transaction do
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
    Friendship.find(:first, :conditions => { :user_id => self.friend_id, :friend_id => self.user_id })
  end
  
private

  def self.create_friend_mirror!(user_id, friend_id)
    friendship = Friendship.create!({ :user_id => user_id, :friend_id => friend_id, :status => Friendship::PENDING_REQUEST })
  end
  
  def assign_friendship_to_default_user_list
    user_list = UserList.find(:first, :conditions => { :user_id => self.user_id, :default => true})
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