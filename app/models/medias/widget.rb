class Medias::Widget < Media
  has_attached_file :file,
                    :styles => { :icon => { :name => "icon.png" } , :index => { :name => "index.html" } },
                    :processors => [:widget],
                    :storage => :s3,
                    :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                    :path => "/widgets/:id/:style.:content_type_extension", # change also in send_zip_file callback
                    :bucket => "uniboard-test2"

  after_post_process :keep_zip_file_for_write
  after_save :send_zip_file
  after_destroy :delete_widget_folder
  
protected
  
  def keep_zip_file_for_write
    @zip_file = file.queued_for_write[:original]
  end

  def send_zip_file
    path = "/widgets/#{id}/"
    logger.debug "Saving zip files."
    Zip::ZipFile.foreach(@zip_file.path) do |zip_file|
      if is_valid_widget_file(zip_file.name)
        logger.debug "Saving #{path + zip_file.name}"
        AWS::S3::S3Object.store(path + zip_file.name,
                                zip_file.get_input_stream.read,
                                file.options[:bucket],
                                :access => :public_read)
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
    !(file_name == "index.html" ||
      file_name == "icon.png" ||
      file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end
  
end