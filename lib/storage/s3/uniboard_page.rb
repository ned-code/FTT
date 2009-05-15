module Storage
  module S3
    module UniboardPage
      include Storage::S3::Base

      def self.extended(base)
      end

      def url
        s3_key.public_link
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
        @s3_key ||= s3_bucket.key(s3_path, true)
      end

      def s3_thumbnail_key
        @s3_thumbnail_key ||= s3_bucket.key(s3_thumbnail_path, true)
      end

      def s3_path
        "documents/#{document.uuid}/#{uuid}.svg"
      end

      def s3_thumbnail_path
        "documents/#{document.uuid}/#{uuid}.thumbnail.jpg"
      end

    end
  end
end
