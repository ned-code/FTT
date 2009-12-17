# == Schema Information
#
# Table name: medias
#
#  uuid       :string(36)      primary key
#  type       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  properties :text(65537)
#  user_id    :integer
#  file       :string(255)
#

class Medias::Thumbnail < Media
  mount_uploader :file, ImageUploader
  
end