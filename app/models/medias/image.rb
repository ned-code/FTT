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
      def io.original_filename
        name = base_uri.path.split('/').last
        name = Medias::Image.check_source(name)
        name
      end
      self.attachment = io
    end
  end

  # after_save
  def set_properties_if_not_present
    unless properties.present?
      update_properties
    end
  end
  
private

  def self.check_source(src)
    extension = ['.png', '.jpg', '.gif']
    src_ok = false
    while !src_ok
      if extension.include?(src[(src.length - 4)..src.length]) || src[(src.length - 5)..src.length] == '.jpeg'
        src_ok = true
      else
        src = src.chop
      end
    end
    src
  end
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
#

