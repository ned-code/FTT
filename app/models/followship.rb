class Followship < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  attr_accessible :following_id, :uuid
  
  # ================
  # = Associations =
  # ================
  
  belongs_to  :follower, :class_name => 'User' # foreign key - follower_id
  belongs_to  :following, :class_name => 'User' # foreign key - following_id
  
  # ================
  # = Validations  =
  # ================  
  validates_uniqueness_of :following_id, :scope => :follower_id

  # =============
  # = Callbacks =
  # =============
  
  after_create :send_start_follower_notification
  after_destroy :send_stop_follower_notification
  
private
  
  # after_create
  def send_start_follower_notification
    Notifier.deliver_start_follower_notification(self.following, self.follower)
  end
  
  # after_destroy
  def send_stop_follower_notification
    Notifier.deliver_stop_follower_notification(self.following, self.follower)
  end
  
end




# == Schema Information
#
# Table name: followships
#
#  follower_id  :string(36)      not null
#  following_id :string(36)      not null
#  created_at   :datetime
#  updated_at   :datetime
#  uuid         :string(36)      default(""), not null, primary key
#

