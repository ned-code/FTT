class Document < ActiveRecord::Base
  has_uuid
  acts_as_authorization_object
  
  serialize :size
  
  # is_paranoid
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC', :dependent => :destroy
  belongs_to :metadata_media, :class_name => 'Media'
  belongs_to :creator, :class_name => 'User'
  
  # ===============
  # = Validations =
  # ===============
  
  # =============
  # = Callbacks =
  # =============
  
  after_create :set_creator_as_owner
  after_create :create_default_page
  
  # =================
  # = Class Methods =
  # =================
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
  end
  
private
  
  # after_create
  def set_creator_as_owner
    accepts_role!("owner", creator)
  end
  
  # after_create
  def create_default_page
    pages.create
  end
  
end




# == Schema Information
#
# Table name: documents
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  size        :text
#  category_id :integer
#

