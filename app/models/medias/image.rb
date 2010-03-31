class Medias::Image < Media
  mount_uploader :file, ImageUploader
  
  # =============
  # = Callbacks =
  # =============
  
  after_save :set_properties_if_not_present
  
protected
  
  # after_save
  def set_properties_if_not_present
    unless properties.present?
      update_attribute(:properties, { :thumb_url => get_mapped_path(file.thumb), :url => get_mapped_path(file) })
    end
  end
  
  def get_mapped_path(image_version)
    if file.s3_bucket == nil
      image_version.url
    else
      "http://#{CarrierWave.yml_s3_bucket(:images).to_s}/#{image_version.store_path}"
    end
  end  
  
end

# == Schema Information
#
# Table name: medias
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(65537)
#  user_id     :integer
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

