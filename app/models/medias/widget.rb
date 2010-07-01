class Medias::Widget < Media

  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"medias/widget/:uuid/:version/:basename.:extension"
  has_attached_file :attachment,
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:widgets_bucket],
                    :s3_host_alias => S3_CONFIG[:widgets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_alias_url" : "/#{attachment_path}"
  
  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 30.megabytes
  # validates_attachment_content_type :attachment, :content_type => ['application/zip', 'application/octet-stream']
  
  attr_accessor :status
  
  # =============
  # = Callbacks =
  # =============
  
  before_save :set_attributes_if_not_present
  before_save :update_new_file
  after_destroy :invalidate_cache
  after_save :invalidate_cache
  
  #after_destroy :delete_widget_folder # Will be done later, we currently need that all files keep unchanged so that existing documents still work
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def version
    properties[:version]
  end
  
  %[icon_url index_url inspector_url width height].each do |property|
    define_method property do
      properties[property.to_sym]
    end
  end

  def attachment_root_url
    @attachement_root_url ||= File.dirname(attachment.url)+"/"
  end

  def attachment_root_path
    @attachement_root_path ||= File.dirname(attachment.path)+"/"
  end
  
private
  
  # before_save
  def set_attributes_if_not_present
    unless properties.present?
      assign_uuid
      
      # Attributes
      self.title = config_dom.root.elements['name'].text
      self.description = config_dom.root.elements['description'].text if config_dom.root.elements['description']
      
      # Properties
      self.properties = {}
      self.properties[:version] = config_dom.root.attribute("version").to_s
      index_url = config_dom.root.elements['content'].attribute("src").to_s
      unless index_url.match(/http:\/\/.*/)
        index_url = File.join(attachment_root_url, config_dom.root.elements['content'].attribute("src").to_s)
      end
      inspector_url = nil
      if (config_dom.root.elements['inspector'])
        inspector_url = config_dom.root.elements['inspector'].attribute('src').to_s
        unless inspector_url.match(/http:\/\/.*/)
          inspector_url = File.join(attachment_root_url, config_dom.root.elements['inspector'].attribute("src").to_s)
        end
      end
      self.properties[:width] = config_dom.root.attribute("width").to_s
      self.properties[:height] = config_dom.root.attribute("height").to_s
      self.properties[:index_url] = index_url
      self.properties[:icon_url] = File.join(attachment_root_url, "icon.png")
      self.properties[:inspector_url] = inspector_url if (inspector_url)
      
      # Extract files to right destination
      extract_files_from_zip_file
    end
  end
  
  # before_save
  def update_new_file
    new_version = config_dom.root.attribute("version").to_s
    if version.nil? || new_version > version
      self.properties[:version] = new_version
      self.properties = properties_from_config_dom(config_dom, attachment_root_url)
      self.title = config_dom.root.elements['name'].text
      self.description = config_dom.root.elements['description'].text if config_dom.root.elements['description']

      extract_files_from_zip_file
    else
      @status = "already_up_to_date"
    end
    @status = "updated_successful"
  rescue
    @status = "updated_failed"
  end
  
  def is_valid_widget_file(file_name)
    !(file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end

  def config_dom
    @config_file_dom ||= Zip::ZipFile.open(attachment_queued_for_write.path) do |file|
      entry = file.find_entry("config.xml")
      entry.present? ? REXML::Document.new(entry.get_input_stream) : nil
    end
  end
  
  def properties_from_config_dom(config_dom, destination_path)
    properties = {}
    index_url = config_dom.root.elements['content'].attribute("src").to_s
    unless index_url.match(/http:\/\/.*/)
      index_url = File.join(destination_path, config_dom.root.elements['content'].attribute("src").to_s)
    end
    inspector_url = nil
    if (config_dom.root.elements['inspector'])
      inspector_url = config_dom.root.elements['inspector'].attribute('src').to_s
      unless inspector_url.match(/http:\/\/.*/)
        inspector_url = File.join(destination_path, config_dom.root.elements['inspector'].attribute("src").to_s)
      end
    end
    
    properties[:version] = config_dom.root.attribute("version").to_s
    properties[:width] = config_dom.root.attribute("width").to_s
    properties[:height] = config_dom.root.attribute("height").to_s
    properties[:index_url] = index_url
    properties[:icon_url] = File.join(destination_path, "icon.png")
    properties[:inspector_url] = inspector_url if (inspector_url)
    properties
  end

  def extract_files_from_zip_file
    Zip::ZipFile.foreach(attachment.to_file.path) do |zip_file|
      if (!zip_file.directory?)
        file_path = File.join(attachment_root_path, zip_file.name)
        if (is_valid_widget_file(file_path))
          if S3_CONFIG[:storage] == 's3'
            AWS::S3::S3Object.store(file_path,
                                    zip_file.get_input_stream.read,
                                    S3_CONFIG[:widgets_bucket],
                                    {
                                      :access => :public_read
                                    })
          else
            FileUtils.mkdir_p(File.dirname(file_path))
            if(!File.directory?(file_path))
              File.open(file_path, 'wb') do |f|
                f << zip_file.get_input_stream.read
              end
            end
          end
        end
      end
    end
  end

  def attachment_queued_for_write
    attachment.queued_for_write[:original]
  end
  
  def invalidate_cache
    Rails.cache.delete("widget_#{self.uuid}")
    if (self.system_name)
      Rails.cache.delete("widget_#{self.system_name}")
    end
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

