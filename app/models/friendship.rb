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
      self.update_attribute('status', Friendship::ACCEPTED )
      self.mirror.update_attribute('status', Friendship::ACCEPTED )
    end
  end
  
  def reject!
    transaction do
      self.mirror.destroy
      self.destroy
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
end

#########################
# Status lists
# - accepted
# - requested
# - pending_request
# - blocked
#