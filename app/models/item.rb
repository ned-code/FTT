class Item < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
#  serialize :data
  composed_of :data, :class_name => 'Hash', :mapping => %w(data to_json),
                         :constructor => JsonHelper.method(:decode_json_and_yaml)
  composed_of :properties, :class_name => 'Hash', :mapping => %w(properties to_json),
                         :constructor => JsonHelper.method(:decode_json_and_yaml)
  composed_of :preferences, :class_name => 'Hash', :mapping => %w(preferences to_json),
                         :constructor => JsonHelper.method(:decode_json_and_yaml)                         
  
  attr_accessible :uuid, :media, :media_id, :media_type, :data, :position, :kind, :inner_html, :properties, :preferences

  attr_accessor_with_default :touch_page_active, true
  attr_accessor :document_uuid
  
  scope :valid,
        :joins => {:page => :document},
        :conditions => ['items.deleted_at IS ? AND pages.deleted_at IS ? AND documents.deleted_at IS ?', nil, nil, nil]
  scope :not_deleted, :conditions => ['items.deleted_at IS ?', nil]
  scope :deleted, :conditions => ['items.deleted_at IS NOT ?', nil]
  
  # ================
  # = Associations =
  # ================
  
  has_many :datastore_entries, :dependent => :destroy
  
  belongs_to :page
  belongs_to :media, :polymorphic => true

  # =============
  # = Callbacks =
  # =============

  after_save :refresh_cache
  after_update :need_update_thumbnail
  #after_destroy :refresh_cache, :need_update_thumbnail  #no more used with safe_delete!

  # ===============
  # = Validations =
  # ===============
  
  # =================
  # = Class Methods =
  # =================
  
  #Look if there is already an item with this uuid and if it was deleted
  #it found, it set the deleted_at to nul and return the item (but not saved), else return false
  
  def self.find_deleted_and_restore(uuid)
    item = Item.find_by_uuid(uuid)
    if item.nil?
      return nil
    else
      if item.deleted_at.nil?
        return nil
      else
        item.deleted_at = nil
        return item
      end
    end
  end
  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
  end
  
  def to_html
    result = "<#{self.data[:tag]} "
    data.each_pair do |key, value| 
      logger.debug key
      logger.debug /innerHTML/.match(key)
      if (!/css|tag|properties|preference/.match(key))
        result += "#{key}=\" #{value}\""
      end
    end
    result += ">"
    if (self.inner_html)
      result += self.inner_html
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

  def as_application_json
    hash = { 'item' => self.attributes }
    hash['item']['data'] = self.data
    hash['item']['properties'] = self.properties
    hash['item']['preferences'] = self.preferences
    hash
  end

  def safe_delete!
    super
    need_update_thumbnail
    refresh_cache
  end

  private

  # after_save
  # after_destroy
  def need_update_thumbnail
    Page.need_update_thumbnail(self.page_id) if touch_page_active == true
  end

  def refresh_cache 
    Document.invalidate_cache(document_uuid)
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
#  uuid        :string(36)      default(""), not null, primary key
#  page_id     :string(36)      not null
#  media_id    :string(36)
#  media_type  :string(255)
#  data        :text(16777215)
#  created_at  :datetime
#  updated_at  :datetime
#  position    :integer(4)
#  kind        :string(255)
#  inner_html  :text(16777215)
#  properties  :text
#  preferences :text
#  deleted_at  :datetime
#

