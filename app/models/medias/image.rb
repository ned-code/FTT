class Medias::Image < Media
  
  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"medias/image/:uuid/:cw_style:basename.:extension"
  has_attached_file :attachment,
                    :styles => { :thumb=> "100x100#", :default => "800x600>" },
                    :default_url   => "",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"


  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 5.megabytes
  validates_attachment_content_type :attachment, :content_type => ['image/jpeg', 'image/png', 'image/gif', 'application/octet-stream']

  attr_accessor :remote_attachment_url
  attr_accessible :remote_attachment_url

  # =============
  # = Callbacks =
  # =============

  before_validation :download_image_provided_by_remote_attachment_url
  after_save :set_properties_if_not_present


  def update_properties
    update_attribute(:properties, {
              :thumb_url => attachment.url(:thumb),
              :default_url => attachment.url(:default),
              :url => attachment.url
    })
  end
  
protected
  
  # before_validation
  def download_image_provided_by_remote_attachment_url
    require 'open-uri'
    if remote_attachment_url.present?
      io = open(URI.parse(remote_attachment_url))
      def io.original_filename; base_uri.path.split('/').last; end
      self.attachment = io
    end
  end

  # after_save
  def set_properties_if_not_present
    unless properties.present?
      update_properties
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

