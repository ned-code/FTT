class Followship < ActiveRecord::Base
  belongs_to  :follower, :class_name => 'User' # foreign key - follower_id
  belongs_to  :following, :class_name => 'User' # foreign key - following_id
  
  # ===============
  # = Validations =
  # ===============
  
  # ================
  # = Associations =
  # ================
  
end

# == Schema Information
#
# Table name: followships
#
#  id           :integer         not null, primary key
#  follower_id  :integer         not null
#  following_id :integer         not null
#  created_at   :datetime
#  updated_at   :datetime
#

