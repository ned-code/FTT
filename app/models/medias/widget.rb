class Medias::Widget < Media
  mount_uploader :file, WidgetUploader, :validate_integrity => true # Upload the zip file
  
  before_save :set_attributes_if_not_present
  #after_destroy :delete_widget_folder # Will be done later, we currently need that all files keep unchanged so that existing documents still work
  
  def version
    properties[:version]
  end
  
  %[icon_url index_url inspector_url width height].each do |property|
    define_method property do
      properties[property.to_sym]
    end
  end  
  
  def update_with_file(zip_file)
    begin
      # Get file version to check if must update or not
      config_dom = config_file_dom(zip_file.path)
      #puts "Current uploaded file path: #{file.current_path}"
      version = config_dom.root.attribute("version").to_s
      #puts "Current version: #{self.version} , new version: #{version}"
      if self.version.nil? || version > self.version
        dest_path = get_destination_path(version)
        store_path = get_storage_path(version)
        
        extract_files_from_zip_file(zip_file.path, store_path)
        
        update_attribute(:properties, properties_from_config_dom(config_dom, dest_path))
        update_attribute(:title, config_dom.root.elements['name'].text)
        update_attribute(:description, config_dom.root.elements['description'].text) if config_dom.root.elements['description']
      else
        return "no_update_needed"
      end
      return "updated"
    rescue
      return "error"
    end
  end
  
  # Not yet modified
  def delete_widget_folder
    path = get_storage_path(@working_version)
    if file.s3_bucket == nil
      #parent_path = path.parent # Gives the app path
      #FileUtils.rm_rf parent_path
      FileUtils.rm_rf path
    else
      check_init_s3_parameters
      s3_bucket = CarrierWave.yml_s3_bucket(:widgets)
      # Delete file
      @s3.delete(path, bucket) # Doesn't work apparently, must try foreach contained file
    end
  end

  
private
  
  def set_attributes_if_not_present
    unless properties.present?
      assign_uuid
    
      temp_file_path = file.current_path
      config_dom = config_file_dom(temp_file_path)
      version = config_dom.root.attribute("version").to_s
    
      title = config_dom.root.elements['name'].text
      description = config_dom.root.elements['description'].text if config_dom.root.elements['description']
    
      # Attributes
      self.title = title
      self.description = description if description
    
      # Properties
      properties = {}
      dest_path = get_destination_path(version)
      index_url = config_dom.root.elements['content'].attribute("src").to_s
      unless index_url.match(/http:\/\/.*/)
        index_url = File.join(dest_path, config_dom.root.elements['content'].attribute("src").to_s)
      end
      inspector_url = nil
      if (config_dom.root.elements['inspector'])
        inspector_url = config_dom.root.elements['inspector'].attribute('src').to_s
        unless inspector_url.match(/http:\/\/.*/)
          inspector_url = File.join(dest_path, config_dom.root.elements['inspector'].attribute("src").to_s)
        end
      end
      properties[:version] = version
      properties[:width] = config_dom.root.attribute("width").to_s
      properties[:height] = config_dom.root.attribute("height").to_s
      properties[:index_url] = index_url
      properties[:icon_url] = File.join(dest_path, "icon.png")
      properties[:inspector_url] = inspector_url if (inspector_url)
    
      self.properties = properties
      
      # Extract files to right destination      
      extract_files_from_zip_file(temp_file_path, file.store_dir)
    end
  end
  
  def check_init_s3_parameters
    if file.s3_bucket != nil && @s3.nil?
      # init s3 instance and bucket
      s3_access_key_id = CarrierWave.yml_s3_access_key_id 
      s3_secret_access_key = CarrierWave.yml_s3_secret_access_key
      @s3 = RightAws::S3Interface.new(s3_access_key_id, s3_secret_access_key)
    end
  end

  def get_destination_path(version)
    if file.s3_bucket == nil
      return "/uploads/#{self.class.to_s.underscore}/#{self.uuid}/#{version}/"
    else
      return "http://#{file.s3_bucket}.s3.amazonaws.com/#{self.class.to_s.underscore}/#{self.uuid}/#{version}/"
    end
  end
  
  def get_storage_path(version)
    if file.s3_bucket == nil
      return "/uploads/#{self.class.to_s.underscore}/#{self.uuid}/#{version}/"
    else
      return "#{self.class.to_s.underscore}/#{self.uuid}/#{version}/"
    end
  end
  
  def s3_headers
    { 'x-amz-acl' => 'public-read' }
  end
  
  def is_valid_widget_file(file_name)
    !(file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end
  
  def config_file_dom(zip_file_path)
    config_file_dom = nil
    Zip::ZipFile.open(zip_file_path) do |zip_file|
      entry = zip_file.find_entry("config.xml")
      config_file_dom = REXML::Document.new(entry.get_input_stream)
    end
    config_file_dom
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
    check_init_s3_parameters
    s3_bucket = CarrierWave.yml_s3_bucket(:widgets)
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
            #puts "File saved on S3: " + filePath
            @s3.put(s3_bucket, filePath, zip_file.get_input_stream.read, s3_headers)
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

