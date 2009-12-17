# == Schema Information
#
# Table name: medias
#
#  uuid       :string(36)      primary key
#  type       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  properties :text(65537)
#  user_id    :integer
#  file       :string(255)
#

class Medias::Widget < Media
  mount_uploader :file, FileUploader
  
  #after_post_process :keep_zip_file_for_write
  after_save :send_zip_file
  before_save :parse_config
  #after_destroy :delete_widget_folder
  
protected
  
  # before_save
  def parse_config
      Zip::ZipFile.open(file.path) { |zip_file|
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
        self.properties = {}        
        self.properties[:content] = config_dom.root.elements['content'].attribute("src").to_s
        self.properties[:width] = config_dom.root.attribute("width").to_s
        self.properties[:height] = config_dom.root.attribute("height").to_s      
        self.properties[:index_url] = index_url
        self.properties[:icon_url] = File.join(File.dirname(file.url), "icon.png")
        if (inspector_url)
          self.properties[:inspector_url] = inspector_url
        end

      }
  end
  
  #after_save
  def send_zip_file
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
  
end
