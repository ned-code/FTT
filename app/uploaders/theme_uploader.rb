# encoding: utf-8

class ThemeUploader < CarrierWave::Uploader::Base

  # Include RMagick or ImageScience support
  # include CarrierWave::RMagick
  # include CarrierWave::ImageScience
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader
  storage   CarrierWave.yml_storage(:assets)
  s3_bucket CarrierWave.yml_s3_bucket(:assets)
  
  # Override the directory where uploaded files will be stored
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    store_prefix = CarrierWave.yml_storage(:assets).to_s == 'file' ? 'uploads/' : ''
    "#{store_prefix}#{model.class.to_s.underscore}/#{model.uuid}/"
  end

  def store_url
    if s3_bucket == nil
      "/#{store_dir}"
    else
      "http://#{s3_bucket}.s3.amazonaws.com/#{model.class.to_s.underscore}/#{model.uuid}/"
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

  # Add a white list of extensions which are allowed to be uploaded,
  # for images you might use something like this:
  def extension_white_list
    %w(zip)
  end

  # Override the filename of the uploaded files
  #     def filename
  #       "something.jpg" if original_filename
  #     end

end
