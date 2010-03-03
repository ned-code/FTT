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
#  user_id    :integer
#  role_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

