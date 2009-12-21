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
      update_attribute(:properties, { :thumb_url => file.thumb.url, :url => file.url })
    end
  end
  
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

