class AppPoll < ActiveRecord::Base
  belongs_to :user
  belongs_to :item
  has_uuid
  set_primary_key :uuid
end

# == Schema Information
#
# Table name: app_polls
#
#  uuid        :string(36)      not null, primary key
#  user_id     :string(36)
#  item_id     :string(36)
#  choices     :string(255)
#  other       :text
#  geolocation :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

