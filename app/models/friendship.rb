class Friendship < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  # ================
  # = Associations =
  # ================
   
  belongs_to :user
  belongs_to :friend, :class_name => 'User', :foreign_key => 'friend_id'
  
  # ===============
  # = Validations =
  # ===============

  validates_presence_of :user_id, :friend_id
  
  # =================
  # = Class Methods =
  # =================
  
  def self.create_friendship!(user_id, friend_id)
    transaction do
      friendship = Friendship.create!({ :user_id => user_id, :friend_id => friend_id, :status => 'requested'})
      Friendship.create_friend_mirror!(friend_id,user_id)
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def accept!
    transaction do
      self.update_attribute('status', 'accepted')
      self.mirror.update_attribute('status', 'accepted')
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
    friendship = Friendship.create!({ :user_id => user_id, :friend_id => friend_id, :status => 'request_pending'})
  end
end

#########################
# Status lists
# - accepted
# - requested
# - request_pending
# - blocked
#