class RolesUser < ActiveRecord::Base
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  belongs_to :role
  
end
