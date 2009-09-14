# == Schema Information
#
# Table name: items
#
#  id         :integer         not null, primary key
#  uuid       :string(255)     not null
#  page_id    :integer         not null
#  media_id   :integer         not null
#  data       :text(65537)
#  item_type  :string(255)     default("object"), not null
#  created_at :datetime
#  updated_at :datetime
#

class Item < ActiveRecord::Base
  serialize :data

  belongs_to :page
  belongs_to :media

end