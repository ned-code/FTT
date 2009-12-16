# == Schema Information
#
# Table name: datastore
#  id          :integer         not null, primary key
#  key         :string(255)     not null
#  value       :text(65537)      not null
#  widget_uuid :string(36)
#  user_id     :string(36)
#  created_at :datetime
#  updated_at :datetime
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
