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
