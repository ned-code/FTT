# encoding: utf-8

class WidgetUploader < CarrierWave::Uploader::Base
  
  # Include RMagick or ImageScience support
  #     include CarrierWave::RMagick
  #     include CarrierWave::ImageScience
  
  # Choose what kind of storage to use for this uploader
  storage   CarrierWave.yml_storage(:widgets)
  s3_bucket CarrierWave.yml_s3_bucket(:widgets)
  
  # Override the directory where uploaded files will be stored
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    store_prefix = CarrierWave.yml_storage(:widgets).to_s == 'file' ? 'uploads/' : ''
    "#{store_prefix}#{model.class.to_s.underscore}/#{model.uuid}/#{model.version}/"
  end
  
  def store_url
    if s3_bucket == nil
      "/#{store_dir}"
    else
      "http://#{s3_bucket}.s3.amazonaws.com/#{model.class.to_s.underscore}/#{model.uuid}/#{model.version}/"
    end
  end
  
  # Provide a default URL as a default if there hasn't been a file uploaded
  #     def default_url
  #       "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  #     end

  # Process files as they are uploaded.
  #     process :scale => [200, 300]
  #
  #     def scale(width, height)
  #       # do something
  #     end

  # Create different versions of your uploaded files
  #     version :thumb do
  #       process :scale => [50, 50]
  #     end

  # Add a white list of extensions which are allowed to be uploaded,
  # for images you might use something like this:
  def extension_white_list
      %w(wgt zip)
  end

  # Override the filename of the uploaded files
  #     def filename
  #       "something.jpg" if original_filename
  #     end

end
