module Storage
  module S3
    module UniboardPage
      include Storage::S3::Base

      def self.extended(base)
      end

      def url
        s3_bucket.key("documents/#{document.uuid}/#{uuid}.svg").public_link
      end

      def thumbnail_url
        s3_bucket.key("documents/#{document.uuid}/#{uuid}.thumbnail.jpg").public_link
      end

    end
  end
end
