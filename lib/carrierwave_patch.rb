# encoding: utf-8


# monkey patch to redefine url method
# in version 0.4.5 of CarrierWave with RightS3, url method don't work,
# so this patch force to use the version 0.4.3 of this method 

module CarrierWave
  module Storage
    class RightS3 < Abstract

      class File

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
end
