class UserListsFriend < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  belongs_to :user_list
  belongs_to :friendship
end
