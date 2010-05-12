class Medias::Widget < Media
  mount_uploader :file, WidgetUploader, :validate_integrity => true # Upload the zip file
  
  attr_accessor :status
  
  # =============
  # = Callbacks =
  # =============
  
  before_save :set_attributes_if_not_present
  before_save :update_new_file
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
      
      mapped_path = get_mapped_path
      index_url = config_dom.root.elements['content'].attribute("src").to_s
      unless index_url.match(/http:\/\/.*/)
        index_url = File.join(mapped_path, config_dom.root.elements['content'].attribute("src").to_s)
      end
      inspector_url = nil
      if (config_dom.root.elements['inspector'])
        inspector_url = config_dom.root.elements['inspector'].attribute('src').to_s
        unless inspector_url.match(/http:\/\/.*/)
          inspector_url = File.join(mapped_path, config_dom.root.elements['inspector'].attribute("src").to_s)
        end
      end
      self.properties[:width] = config_dom.root.attribute("width").to_s
      self.properties[:height] = config_dom.root.attribute("height").to_s
      self.properties[:index_url] = index_url
      self.properties[:icon_url] = File.join(mapped_path, "icon.png")
      self.properties[:inspector_url] = inspector_url if (inspector_url)
      
      # Extract files to right destination
      extract_files_from_zip_file(file.current_path, file.store_dir)
    end
  end
  
  # before_save
  def update_new_file
    if file_changed?
      new_version = config_dom.root.attribute("version").to_s
      if version.nil? || new_version > version
        self.properties[:version] = new_version
        self.properties = properties_from_config_dom(config_dom, get_mapped_path)
        self.title = config_dom.root.elements['name'].text
        self.description = config_dom.root.elements['description'].text if config_dom.root.elements['description']
        
        extract_files_from_zip_file(file.current_path, file.store_dir)
      else
        @status = "already_up_to_date"
      end
      @status = "updated_successful"
    end
  rescue
    @status = "updated_failed"
  end
  
  # # Not yet modified
  # def delete_widget_folder
  #   path = get_storage_path(@working_version)
  #   if file.s3_bucket == nil
  #     #parent_path = path.parent # Gives the app path
  #     #FileUtils.rm_rf parent_path
  #     FileUtils.rm_rf path
  #   else
  #     check_init_s3_parameters
  #     s3_bucket = CarrierWave.yml_s3_bucket(:widgets)
  #     # Delete file
  #     @s3.delete(path, bucket) # Doesn't work apparently, must try foreach contained file
  #   end
  # end
  
  def get_mapped_path
    if file.s3_bucket == nil
      file.store_url
    else
      path = Pathname.new(file.store_path)
      "http://#{CarrierWave.yml_s3_bucket(:widgets).to_s}/#{path.dirname}"
    end
  end
  
  def is_valid_widget_file(file_name)
    !(file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end
  
  def config_dom
    @config_file_dom ||= Zip::ZipFile.open(file.current_path) do |zip_file|
      entry = zip_file.find_entry("config.xml")
      config_file_dom = REXML::Document.new(entry.get_input_stream)
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
  
  def extract_files_from_zip_file(file_path, destination_path)
    Zip::ZipFile.foreach(file_path) do |zip_file|
      if (!zip_file.directory?)
        filePath = File.join(destination_path, zip_file.name)
        
        if (is_valid_widget_file(filePath))
          # Check storage mode
          if file.s3_bucket == nil
            local_path = File.join(Rails.root, 'public', filePath)
            FileUtils.mkdir_p(File.dirname(local_path))
            if(!File.directory?(local_path))
              File.open(local_path, 'wb') do |file|
                file << zip_file.get_input_stream.read
              end 
              #puts "File saved to path:" + local_path
            end
          else
            @s3 ||= RightAws::S3Interface.new(file.s3_access_key_id, file.s3_secret_access_key)
            @s3.put(file.s3_bucket, filePath, zip_file.get_input_stream.read, 'x-amz-acl' => 'public-read')
          end
        end
      end
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

