class UserListsFriend < ActiveRecord::Base
  belongs_to :user_list
  belongs_to :friendship
end
