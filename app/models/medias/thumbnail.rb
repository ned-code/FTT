class Medias::Thumbnail < Media
  mount_uploader :file, ImageUploader
  
end

# == Schema Information
#
# Table name: medias
#
#  id         :integer         not null, primary key
#  uuid       :string(36)
#  type       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  properties :text(65537)
#  user_id    :integer
#  file       :string(255)
#

