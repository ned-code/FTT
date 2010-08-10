class AppPoll < ActiveRecord::Base
  belongs_to :user
  belongs_to :item
  set_primary_key :uuid
end
