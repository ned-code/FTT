# == Schema Information
#
# Table name: documents
#
#  id                :integer         not null, primary key
#  uuid              :string(255)     not null
#  metadata_media_id :integer
#  title             :string(255)
#  deleted_at        :datetime
#  created_at        :datetime
#  updated_at        :datetime
#

class Document < ActiveRecord::Base
  acts_as_authorizable
  has_uuid
  is_paranoid

  # ===============
  # = Validations =
  # ===============

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC', :dependent => :destroy
  belongs_to :metadata_media, :class_name => 'Media'

  # =================
  # = Class Methods =
  # =================
  
  def self.find_by_id_or_uuid!(id)
    id =~ UUID_FORMAT_REGEX ? find_by_uuid!(id) : find(id)
  end

  # ====================
  # = Instance Methods =
  # ====================

end