module Storage
  module S3
    module UniboardPage
      include Storage::S3::Base

      def self.extended(base)
      end

      def url
        s3_bucket.s3.interface.get_link(s3_bucket.name, s3_key_name, DEFAULT_URL_EXPIRE_TIME)
      end

      def mime_type
        s3_key.headers['content-type']
      end

      def thumbnail_url
        s3_thumbnail_key.public_link
      end

      def thumbnail_mime_type
        s3_thumbnail_key.headers['content-type']
      end

      private

      def s3_key
        @s3_key ||= s3_bucket.key(s3_key_name, true)
      end

      def s3_key_name
        "documents/#{document.uuid}/#{uuid}.svg"
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
