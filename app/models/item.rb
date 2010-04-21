class Item < ActiveRecord::Base
  has_uuid
  serialize :data
  
  attr_accessible :uuid, :media, :media_id, :media_type, :data, :position
  
  # see XmppItemObserver
  attr_accessor_with_default :must_notify, false
  
  # ================
  # = Associations =
  # ================
  
  has_many :datastore_entries, :dependent => :destroy
  
  belongs_to :page, :touch => true
  belongs_to :media, :polymorphic => true
  
  # ====================
  # = Instance Methods =
  # ====================
  
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

  def deep_clone
    cloned_item = self.clone
    cloned_item.uuid = nil
    cloned_item.created_at = nil
    cloned_item.updated_at = nil
    cloned_item
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

