# == Schema Information
#
# Table name: datastore_entries
#
#  id          :integer         not null, primary key
#  ds_key      :string(255)     not null
#  ds_value    :text(65537)     not null
#  widget_uuid :string(36)
#  user_id     :string(36)
#  created_at  :datetime
#  updated_at  :datetime
#

class DatastoreEntry < ActiveRecord::Base  
  
  # ================
  # = Associations =
  # ================
  belongs_to :widget, :class_name => "Medias::Widget"
  belongs_to :user
    
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