# == Schema Information
#
# Table name: pages
#
#  uuid         :string(36)      primary key
#  document_id  :string(36)      not null
#  thumbnail_id :string(36)
#  position     :integer         default(0), not null
#  version      :integer         default(1), not null
#  data         :text(65537)
#  created_at   :datetime
#  updated_at   :datetime
#

class Page < ActiveRecord::Base
  has_uuid
  
  default_scope :order => "position ASC"
  serialize :data
  
  def after_initialize
    self.data ||= { :css => { :width => "1280px", :height => "720px", :backgroundColor => "black" } }
  end

  # ================
  # = Associations =
  # ================
  
  has_many :items, :dependent => :destroy
  belongs_to :document
  belongs_to :thumbnail, :class_name => "Media"
  
  # ===============
  # = Validations =
  # ===============
  
  # =============
  # = Callbacks =
  # =============
  
  before_create :set_position

  # =================
  # = Class Methods =
  # =================
  
  def self.find_by_id_or_position(attr)
    if attr =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      find(attr)
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
  
  
private

  # before_create
  def set_position
    self.position = document.new_record? ? 0 : document.pages.count
  end

end
