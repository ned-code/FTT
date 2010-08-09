class UserList < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
end
