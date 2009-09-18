# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)      primary key
#  page_id    :string(36)      not null
#  media_id   :string(36)
#  media_type :string(255)
#  data       :text(65537)
#  created_at :datetime
#  updated_at :datetime
#

class Item < ActiveRecord::Base
  has_uuid  
  serialize :data

  # ================
  # = Associations =
  # ================

  belongs_to :page
  belongs_to :media, :polymorphic => true

end
