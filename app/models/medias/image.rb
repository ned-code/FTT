class Medias::Image < Media
  # mount_uploader :file, ImageUploader

  store_prefix = true ? '/uploads' : ''  
  attachment_path = store_prefix+"/medias/image/:uuid/:cw_style:basename.:extension"
  has_attached_file :attachment,
                    :styles => { :thumb=> "100x100#", :default => "800x600>" },
                    :default_url   => "",
                    :url => attachment_path,
                    :path => ":rails_root/public" + attachment_path

  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 5.megabytes
  validates_attachment_content_type :attachment, :content_type => ['image/jpeg', 'image/png', 'image/gif', 'application/octet-stream']
  
  # =============
  # = Callbacks =
  # =============
  
  after_save :set_properties_if_not_present
  
protected
  
  # after_save
  def set_properties_if_not_present
    unless properties.present?
      update_attribute(:properties, {
              :thumb_url => attachment.url(:thumb),
              :default_url => attachment.url(:default),
              :url => attachment.url 
      })
    end
  end
  
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

