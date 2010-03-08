class Followship < ActiveRecord::Base
  belongs_to  :follower, :class_name => 'User' # foreign key - follower_id
  belongs_to  :following, :class_name => 'User' # foreign key - following_id
  
  after_create :send_start_follower_notification
  after_destroy :send_stop_follower_notification
  
  # ===============
  # = Validations =
  # ===============
  
  # ================
  # = Associations =
  # ================
  
private
  
  def send_start_follower_notification
    Notifier.deliver_start_follower_notification(self.following, self.follower)
  end
  
  def send_stop_follower_notification
    Notifier.deliver_stop_follower_notification(self.following, self.follower)
  end
  
end


# == Schema Information
#
# Table name: followships
#
#  id           :integer(4)      not null, primary key
#  follower_id  :integer(4)      not null
#  following_id :integer(4)      not null
#  created_at   :datetime
#  updated_at   :datetime
#

