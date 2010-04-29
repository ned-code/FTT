require "xmpp_notification"

class Page < ActiveRecord::Base
  has_uuid
  
  attr_accessible :uuid, :position, :version, :data, :title, :items_attributes

  attr_accessor_with_default :touch_document_active, true
  
  serialize :data
  
  # ================
  # = Associations =
  # ================
  
  has_many :items, :dependent => :delete_all
  belongs_to :document
  belongs_to :thumbnail, :class_name => "Medias::Thumbnail"
  belongs_to :layout
  
  # should be placed after associations declaration
  accepts_nested_attributes_for :items
  
  # ==========
  # = Scopes =
  # ==========
  
  default_scope :order => "position ASC"
  
  # ===============
  # = Validations =
  # ===============
  validates_uniqueness_of :uuid  

  # =============
  # = Callbacks =
  # =============
  
  before_save :update_position_if_moved
  before_save :set_page_data
  before_create :set_position
  after_save :touch_document
  after_destroy :update_next_page_position, :touch_document

  # =================
  # = Class Methods =
  # =================
  
  def self.find_by_uuid_or_position!(attr)
    if attr =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      find_by_uuid!(attr)
    else
      find_by_position!(attr.to_i - 1)
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def next
    Page.first(
      :conditions => ['position > ? AND document_id = ?', position, document_id],
      :order      => 'position ASC'
    )
  end
  
  def previous
    Page.first(
      :conditions => ['position < ? AND document_id = ?', position, document_id],
      :order      => 'position DESC'
    )
  end
  
  def thumbnail_url
    thumbnail.try(:url) || "/images/no_thumb.jpg"
  end
  
  def to_param
    uuid
  end

  def deep_clone
    cloned_page = self.clone
    cloned_page.touch_document_active = false
    cloned_page.uuid = nil
    cloned_page.created_at = nil
    cloned_page.updated_at = nil
    self.items.each do |item|
      cloned_page.items << item.deep_clone
    end
    cloned_page
  end

  private
  
  # before_save
  def update_position_if_moved
    if (!self.new_record? && self.position_was != self.position)
      logger.debug("must change page position")
      if (self.position < self.position_was)
        Page.update_all("position = position + 1", "position < #{self.position_was.to_i} and position >= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")        
      else
        Page.update_all("position = position - 1", "position > #{self.position_was.to_i} and position <= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")                
      end
    end
  end
  
  # before_save
  def set_page_data
    if document.present?
      default_css = { :width => document.formated_size[:width], :height => document.formated_size[:height] }
      if (self.data)
        self.data[:css] ||= default_css
      else
        self.data = { :css =>  default_css }
      end
    end
  end
  
  # before_create
  def set_position
    self.position ||= document.nil? ? 0 : document.pages.count
    #update following pages
    Page.update_all("position = position + 1", "position >= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end
  
  # after_destroy
  def update_next_page_position
    Page.update_all("position = position - 1", "position > #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end

  # after_save
  # after_destroy
  def touch_document
    self.document.touch if touch_document_active == true
  end
  
end

# == Schema Information
#
# Table name: pages
#
#  id           :integer         not null, primary key
#  uuid         :string(36)
#  document_id  :integer         not null
#  thumbnail_id :integer
#  position     :integer         not null
#  version      :integer         default(1), not null
#  data         :text(65537)
#  created_at   :datetime
#  updated_at   :datetime
#  title        :string(255)     default("undefined")
#

