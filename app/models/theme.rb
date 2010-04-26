class Theme < ActiveRecord::Base
  mount_uploader :style, StyleUploader
  mount_uploader :thumbnail, ThumbnailUploader
  
  # ================
  # = Associations =
  # ================
  
  has_many :documents
  has_many :layouts
end
