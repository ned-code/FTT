class Medias::Widget < Media
  mount_uploader :file, FileUploader
  
  #after_post_process :keep_zip_file_for_write
  after_save :set_properties_and_send_zip_file
  #after_destroy :delete_widget_folder
  
protected
  
  # after_save
  def set_properties_and_send_zip_file
    unless properties.present? # workaround because after_create callback give the tmp carrierwave path
      update_attribute(:properties, properties_from_config_xml)
      extract_files_from_zip
    end
  end
    
  def delete_widget_folder
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
  
  def properties_from_config_xml
    properties = {}
    Zip::ZipFile.open(file.path) do |zip_file|
      entry = zip_file.find_entry("config.xml")
      config_dom = REXML::Document.new(entry.get_input_stream)
      index_url = config_dom.root.elements['content'].attribute("src").to_s
      unless index_url.match(/http:\/\/.*/)
        index_url = File.join(File.dirname(file.url), config_dom.root.elements['content'].attribute("src").to_s)
      end
      inspector_url = nil
      if (config_dom.root.elements['inspector'])
        inspector_url = config_dom.root.elements['inspector'].attribute('src').to_s
        unless inspector_url.match(/http:\/\/.*/)
          inspector_url = File.join(File.dirname(file.url), config_dom.root.elements['inspector'].attribute("src").to_s)
        end
      end
      properties[:content] = config_dom.root.elements['content'].attribute("src").to_s
      properties[:width] = config_dom.root.attribute("width").to_s
      properties[:height] = config_dom.root.attribute("height").to_s
      properties[:index_url] = index_url
      properties[:icon_url] = File.join(File.dirname(file.url), "icon.png")
      properties[:inspector_url] = inspector_url if (inspector_url)
    end
    properties
  end
  
  # Not working with S3 yet
  def extract_files_from_zip
    #    path = "/widgets/#{id}/"
    #    logger.debug "Saving zip files."
    #    Zip::ZipFile.foreach(@zip_file.path) do |zip_file|
    #      if is_valid_widget_file(zip_file.name)
    #        logger.debug "Saving #{path + zip_file.name}"
    #        AWS::S3::S3Object.store(path + zip_file.name,
    #                                zip_file.get_input_stream.read,
    #                                file.options[:bucket],
    #                                :access => :public_read)
    #      end
    #    end
    dest_path = File.dirname(file.path)
    logger.debug "Saving zip files."
    Zip::ZipFile.foreach(file.path) do |zip_file|
      if (!zip_file.directory?)
        logger.debug "Saving #{dest_path + "\/"+ zip_file.name}"
        filePath = dest_path + "\/" + zip_file.name
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
#  uuid              :string(36)
#  type              :string(255)
#  file_file_name    :string(255)
#  file_content_type :string(255)
#  file_file_size    :integer
#  file_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#  properties        :text(65537)
#  file              :string(255)
#  user_id           :integer
#

