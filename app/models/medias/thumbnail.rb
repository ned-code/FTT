class Medias::Thumbnail < Media
  mount_uploader :file, ImageUploader
  
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

