class Layout < ActiveRecord::Base
  mount_uploader :thumbnail, ThumbnailUploader
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :theme
  has_many :pages
  has_one :thumbnail
  
end
