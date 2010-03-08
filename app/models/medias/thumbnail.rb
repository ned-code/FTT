class Medias::Thumbnail < Media
  mount_uploader :file, ImageUploader
  
end


# == Schema Information
#
# Table name: medias
#
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(16777215)
#  user_id     :integer(4)
#  file        :string(255)
#  id          :integer(4)      not null, primary key
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

