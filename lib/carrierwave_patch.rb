# encoding: utf-8

module CarrierWave
  module Storage
    class RightS3 < Abstract
      class File
        # redefine url method
        # in version 0.4.5 of CarrierWave with RightS3, url method don't work,
        # so this patch force to use the version 0.4.3 of this method
        def url
          if @uploader.s3_cnamed
            ["http://", @uploader.s3_bucket, @path].compact.join('/')
          else
            ["http://#{@uploader.s3_bucket}.s3.amazonaws.com", @path].compact.join('/')
          end
        end
      end
    end
  end

  class SanitizedFile
    # redefine sanitize to remove + in filename
    def sanitize(name)
      name = name.gsub("\\", "/") # work-around for IE
      name = File.basename(name)
      name = name.gsub(/[^a-zA-Z0-9\.\-_]/,"_")
      name = "_#{name}" if name =~ /\A\.+\z/
      name = "unnamed" if name.size == 0
      return name.downcase
    end
  end
end
