# == Schema Information
#
# Table name: pages
#
#  id          :integer         not null, primary key
#  uuid        :string(255)     not null
#  position    :integer         not null
#  version     :integer         default(1), not null
#  document_id :integer         not null
#  data        :text(65537)
#  created_at  :datetime
#  updated_at  :datetime
#

class Page < ActiveRecord::Base
  default_scope :order => "position ASC"
  serialize :data
  
  # ===============
  # = Validations =
  # ===============

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  # ================
  # = Associations =
  # ================
  
  belongs_to :document
  belongs_to :thumbnail, :class_name => "Media"
  has_many :items, :dependent => :destroy
  
  # =================
  # = Class Methods =
  # =================
      
  def self.find_by_id_or_uuid!(id)
    id =~ UUID_FORMAT_REGEX ? find_by_uuid!(id) : find(id)
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def next
    find(:first,
         :conditions => ['position > ? AND document_id = ?', position, document_id],
         :order => 'position ASC')
  end
  
  def previous
    find(:first,
         :conditions => ['position < ? AND document_id = ?', position, document_id],
         :order => 'position DESC')
  end
  
  def thumbnail_url
    thumbnail.try(:url) || "/images/noThumb.jpg"
  end

end