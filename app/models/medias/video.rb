class Medias::Video < Media
  mount_uploader :file, FileUploader
  
end

# == Schema Information
#
# Table name: medias
#
#  uuid              :string(36)
#  type              :string(255)
#  file_file_name    :string(255)
#  file_content_type :string(255)
#  file_file_size    :integer
#  file_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#  properties        :text(65537)
#  file              :string(255)
#  user_id           :integer
#

