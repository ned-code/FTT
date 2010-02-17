require "xmpp_notification"

class Page < ActiveRecord::Base
  has_uuid
  
  default_scope :order => "position ASC"
  serialize :data
    
  def after_initialize
    self.data ||= { :css => { :width => "800px", :height => "600px", :backgroundColor => "#fff" } }
  end
  
  # ================
  # = Associations =
  # ================
  
  has_many :items, :dependent => :delete_all
  accepts_nested_attributes_for :items  
  belongs_to :document
  belongs_to :thumbnail, :class_name => "Medias::Thumbnail"
  
  # ===============
  # = Validations =
  # ===============
  
  # =============
  # = Callbacks =
  # =============
  
  before_create :set_position
  before_save :update_position_if_moved
  after_destroy :update_next_page_position
  
  # =================
  # = Class Methods =
  # =================
  
  def self.find_by_uuid_or_position(attr)
    if attr =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      find_by_uuid(attr)
    else
      find_by_position(attr.to_i - 1)
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def next
    Page.find(:first,
              :conditions => ['position > ? AND document_id = ?', position, document_id],
              :order => 'position ASC')
  end
  
  def previous
    Page.find(:first,
              :conditions => ['position < ? AND document_id = ?', position, document_id],
              :order => 'position DESC')
  end
  
  def thumbnail_url
    thumbnail.try(:url) || "/images/no_thumb.jpg"
  end
  
  def to_param
    uuid
  end
  
private
  
  # before_create
  def set_position
    self.position ||= document.nil? ? 0 : document.pages.count
    #update following pages
    Page.update_all("position = position + 1", "position >= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end
  
  def update_next_page_position
    Page.update_all("position = position - 1", "position > #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end
  
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

