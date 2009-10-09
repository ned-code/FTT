class Medias::Widget < Media
  has_attached_file :file

  
  #after_post_process :keep_zip_file_for_write
  after_save :send_zip_file
  #after_destroy :delete_widget_folder
  
  def index_url
    File.join(File.dirname(file.url), "index.html");
  end
  
  def icon_url
    File.join(File.dirname(file.url), "icon.png");
  end
  
protected
  
  def keep_zip_file_for_write
    @zip_file = file.queued_for_write[:original]
  end
  
  def send_zip_file
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