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
#  user_id    :integer(4)
#  role_id    :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

