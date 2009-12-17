# == Schema Information
#
# Table name: datastores
#
#  id          :integer         not null, primary key
#  ds_key      :string(255)     not null
#  ds_value    :text(65537)     not null
#  widget_uuid :string(36)
#  user_id     :string(36)
#  created_at  :datetime
#  updated_at  :datetime
#

class Datastore < ActiveRecord::Base
  # ================
  # = Associations =
  # ================
  
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

