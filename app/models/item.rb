class Item < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  serialize :data
  
  attr_accessible :uuid, :media, :media_id, :media_type, :data, :position, :kind
  
  # see XmppItemObserver
  attr_accessor_with_default :must_notify, false

  attr_accessor_with_default :touch_page_active, true
  
  # ================
  # = Associations =
  # ================
  
  has_many :datastore_entries, :dependent => :destroy
  
  belongs_to :page
  belongs_to :media, :polymorphic => true

  # =============
  # = Callbacks =
  # =============

  after_save :touch_page
  after_destroy :touch_page

  # ===============
  # = Validations =
  # ===============
  validates_uniqueness_of :uuid  

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
    cloned_item.touch_page_active = false
    cloned_item.uuid = nil
    cloned_item.created_at = nil
    cloned_item.updated_at = nil
    cloned_item
  end

  private

  # after_save
  # after_destroy
  def touch_page
    self.page.touch if touch_page_active == true
  end

  def self.sanitize_html_to_serialize(html)
    sanitized_html = ""
    html.each do |line|
      sanitized_html += line.strip
    end
    sanitized_html
  end

end



# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)      primary key
#  page_id    :string(36)      not null
#  media_id   :string(36)
#  media_type :string(255)
#  data       :text(16777215)
#  created_at :datetime
#  updated_at :datetime
#  position   :integer(4)
#  kind       :string(255)
#

