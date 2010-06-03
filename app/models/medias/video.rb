class Medias::Video < Media

  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"medias/video/:uuid/:cw_style:basename.:extension"
  has_attached_file :attachment,
                    :styles => {},
                    :default_url   => "",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"
  
  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 5.megabytes
  validates_attachment_content_type :attachment, :content_type => ['application/octet-stream']
  
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

