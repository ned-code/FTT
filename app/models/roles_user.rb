class RolesUser < ActiveRecord::Base
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  belongs_to :role
  
end



# == Schema Information
#
# Table name: roles_users
#
#  user_id    :string(36)
#  role_id    :string(36)
#  created_at :datetime
#  updated_at :datetime
#

