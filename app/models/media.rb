class Media < ActiveRecord::Base
  has_uuid
  serialize :properties
  
  attr_accessible :uuid, :file, :properties, :system_name, :title, :description
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  
  # ===============
  # = Validations =
  # ===============
  
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
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(65537)
#  user_id     :integer
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

