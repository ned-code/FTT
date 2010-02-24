require "xmpp_notification.rb"

class Item < ActiveRecord::Base
  has_uuid
  serialize :data
  
  # see XmppItemObserver
  attr_accessor_with_default :must_notify, false
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :page
  belongs_to :media, :polymorphic => true
  
  def to_param
    uuid
  end

  def after_initialize
    self.must_notify = false
  end

end


# == Schema Information
#
# Table name: items
#
#  id         :integer         not null, primary key
#  uuid       :string(36)
#  page_id    :integer         not null
#  media_id   :integer
#  media_type :string(255)
#  data       :text(65537)
#  created_at :datetime
#  updated_at :datetime
#  position   :integer
#

