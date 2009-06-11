module Storage
  module S3
    module UniboardPage
      include Storage::S3::Base

      def self.extended(base)
      end

      def url(format = "svg", request_domain = nil)
        if (format == "svg")
          s3_bucket.s3.interface.get_link(s3_bucket.name, s3_key_name(format), DEFAULT_URL_EXPIRE_TIME)
        else
          s3_url = s3_bucket.s3.interface.get_link(s3_bucket.name, s3_key_name(format), DEFAULT_URL_EXPIRE_TIME)
          s3_url.gsub(/https:\/\/.+\.s3\.amazonaws\.com/,  "#{request_domain}/files")
        end
      end

      def mime_type
        s3_key.headers['content-type']
      end

      def thumbnail_url(request_domain = nil)
        s3_thumbnail_key.public_link
      end

      def thumbnail_mime_type
        s3_thumbnail_key.headers['content-type']
      end

      private

      def s3_key
        @s3_key ||= s3_bucket.key(s3_key_name, true)
      end

      def s3_key_name(format = "svg")
        "documents/#{document.uuid}/#{uuid}.#{format}"
      end

      def s3_thumbnail_key
        @s3_thumbnail_key ||= s3_bucket.key(s3_thumbnail_key_name, true)
      end

      def s3_thumbnail_key_name
        "documents/#{document.uuid}/#{uuid}.thumbnail.jpg"
      end

    end
  end
end
