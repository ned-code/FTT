class Medias::Widget < Media
  
  #before_save :set_properties_and_store_file # How bypass the save on update???
  
  after_destroy :delete_widget_folder
  
  def title
    properties[:title]
  end
  
  def description
    properties[:description]
  end
  
  def icon_url
    properties[:icon_url]
  end
  
  def index_url
    properties[:index_url]
  end
  
  def inspector_url
    properties[:inspector_url]
  end
  
  def width
    properties[:width]
  end
  
  def height
    properties[:height]
  end
  
  def version
    properties[:version]
  end
  
  def set_properties_from_config_dom(config_dom)
    update_attribute(:properties, properties_from_config_dom(config_dom))
  end
  
  def set_properties_and_store_file
    file_type = file.content_type # Must be application/zip or application/octet-stream
    if file_type == "application/zip" || file_type == "application/octet-stream"
      config_dom = config_file_dom(file.path)
      # Retrieve version number from config.xml file, so that the destination path can be built
      version = config_dom.root.attribute("version").to_s
         
      update_attribute_without_save(:properties, properties_from_config_dom(config_dom, widget_linking_path(version)))
      extract_files_from_zip_file(file.path, storage_destination_path(version))
    end
  end
  
  def update_action(zip_file)
    file_type = zip_file.content_type # Must be application/zip or application/octet-stream
    if file_type == "application/zip" || file_type == "application/octet-stream"
      config_dom = config_file_dom(zip_file.path)
      version = config_dom.root.attribute("version").to_s
      #puts "Current version: #{self.version} , new version: #{version}"
      if self.version.nil? || version > self.version
        update_attribute(:properties, properties_from_config_dom(config_dom, widget_linking_path(version)))

        extract_files_from_zip_file(zip_file.path, storage_destination_path(version))
      end
    end
  end
  
  def delete_widget_folder
    path = Pathname.new("public/uploads/medias/widget/#{uuid}/#{version}")
    parent_path = path.parent # Gives the app path
    FileUtils.rm_rf parent_path
    # TODO, request all object keys in path and delete all
    # path = "/widgets/#{id}/"
    # logger.debug "Removing zip files."
    # AWS::S3::S3Object.delete(path, file.options[:bucket])
  end
  
private
  
  def is_valid_widget_file(file_name)
    !(file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end
  
  def update_attribute_without_save(name, value)
    send(name.to_s + '=', value)
  end
  
  def storage_destination_path(version)
    "public/uploads/#{self.class.to_s.underscore}/#{uuid}/#{version}"
  end
  
  def widget_linking_path(version)
    "/uploads/#{self.class.to_s.underscore}/#{uuid}/#{version}"
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
    properties[:title] = config_dom.root.elements['name'].text
    properties[:description] = config_dom.root.elements['description'].text
    properties[:version] = config_dom.root.attribute("version").to_s
    properties[:content] = config_dom.root.elements['content'].attribute("src").to_s
    properties[:width] = config_dom.root.attribute("width").to_s
    properties[:height] = config_dom.root.attribute("height").to_s
    properties[:index_url] = index_url
    properties[:icon_url] = File.join(destination_path, "icon.png")
    properties[:inspector_url] = inspector_url if (inspector_url)
    properties
  end
  
  # Not working with S3 yet
  def extract_files_from_zip_file(file_path, destination_path)
    #path = "/widgets/#{id}/"
    #    logger.debug "Saving zip files."
    #    Zip::ZipFile.foreach(@zip_file.path) do |zip_file|
    #    if is_valid_widget_file(zip_file.name)
    #      logger.debug "Saving #{path + zip_file.name}"
    #      AWS::S3::S3Object.store(path + zip_file.name,
    #                           zip_file.get_input_stream.read,
    #                           file.options[:bucket],
    #                          :access => :public_read)
    #     end
    #   end
    Zip::ZipFile.foreach(file_path) do |zip_file|
      if (!zip_file.directory?)
        logger.debug "Saving #{destination_path + "\/"+ zip_file.name}"
        filePath = destination_path + "\/" + zip_file.name
        if (is_valid_widget_file(filePath))
          FileUtils.mkdir_p(File.dirname(filePath))
          if(!File.directory?(filePath))
            File.open(filePath, 'wb') do |file|
              file << zip_file.get_input_stream.read
            end 
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
#

