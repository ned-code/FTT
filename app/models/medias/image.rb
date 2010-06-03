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

