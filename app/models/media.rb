class Media < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  serialize :properties
  
  attr_accessible :uuid, :attachment, :properties, :system_name, :title, :description, :created_at #, :remote_file_url
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  
  # ===============
  # = Validations =
  # ===============

  validates_uniqueness_of :system_name, :allow_nil => true, :allow_blank => true
  
  # =============
  # = Callbacks =
  # =============

  # =================
  # = Class Methods =
  # =================
  
  def self.complex_find(params)
    params[:type] ? find_all_by_type(params[:type]) : all
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
  end
  
  # overwrite to_json options
  def to_json(options = {})
    ActiveSupport::JSON.encode(as_json(options.merge(:except => :file)))
  end
  
end



# == Schema Information
#
# Table name: medias
#
#  uuid        :string(36)      primary key
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(16777215)
#  user_id     :string(36)
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

