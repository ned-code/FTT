class Medias::Thumbnail < Media

  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"medias/thumbnail/:uuid/:cw_style:basename.:extension"
  has_attached_file :attachment,
                    :styles => {},
                    :default_url   => "",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"

  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 1.megabytes
  validates_attachment_content_type :attachment, :content_type => ['image/jpeg', 'image/png', 'image/gif', 'application/octet-stream']
  
end





# == Schema Information
#
# Table name: medias
#
#  uuid                    :string(36)      default(""), not null, primary key
#  type                    :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#  properties              :text(16777215)
#  user_id                 :string(36)
#  attachment_file_name    :string(255)
#  system_name             :string(255)
#  title                   :string(255)
#  description             :text
#  attachment_content_type :string(255)
#  attachment_file_size    :integer(4)
#  attachment_updated_at   :datetime
#  favorites               :boolean(1)      default(FALSE)
#

