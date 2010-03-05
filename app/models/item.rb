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

  def to_html
    result = "<#{self.data[:tag]} "
    data.each_pair do |key, value| 
    logger.debug key
    logger.debug /innerHTML/.match(key)
      if (!/innerHTML|css|tag|properties|preference/.match(key))
        result += "#{key}=\" #{value}\""
      end
    end
    result += ">"
    if (data[:innerHTML])
      result += data[:innerHTML]
    end
    result += "</#{self.data[:tag]}>"
  end  
end


# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)
#  page_id    :integer(4)
#  media_id   :integer(4)
#  media_type :string(255)
#  data       :text(16777215)
#  created_at :datetime
#  updated_at :datetime
#  id         :integer(4)      not null, primary key
#  position   :integer(4)
#

