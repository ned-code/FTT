# == Schema Information
#
# Table name: documents
#
#  uuid       :string(36)      primary key
#  title      :string(255)
#  deleted_at :datetime
#  created_at :datetime
#  updated_at :datetime
#

class Document < ActiveRecord::Base
  has_uuid
  acts_as_authorization_object
#  is_paranoid
  
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

end
