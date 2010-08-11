class AppPoll < ActiveRecord::Base
  belongs_to :user
  belongs_to :item
  has_uuid
  set_primary_key :uuid
end
