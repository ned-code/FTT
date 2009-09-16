# == Schema Information
#
# Table name: documents
#
#  uuid              :string(36)      primary key
#  metadata_media_id :string(36)
#  title             :string(255)
#  deleted_at        :datetime
#  created_at        :datetime
#  updated_at        :datetime
#

class Document < ActiveRecord::Base
  has_uuid
  is_paranoid
  
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
