class Document < ActiveRecord::Base
  has_uuid
  acts_as_authorization_object
  # is_paranoid
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC', :dependent => :destroy
  belongs_to :metadata_media, :class_name => 'Media'
  
  # ===============
  # = Validations =
  # ===============
  
  # =================
  # = Class Methods =
  # =================
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
  end
  
end

# == Schema Information
#
# Table name: documents
#
#  uuid       :string(36)
#  title      :string(255)
#  deleted_at :datetime
#  created_at :datetime
#  updated_at :datetime
#

