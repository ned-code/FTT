module Storage
  module Filesystem
    module UniboardPage
      include Storage::Filesystem::Base

      def self.extended(base)
      end

      def url
        "file://#{fs_path}"
      end

      def mime_type
        get_content_type_from_mime_types(fs_path)
      end

      def thumbnail_url
        "file://#{fs_thumbnail_path}"
      end

      def thumbnail_mime_type
        get_content_type_from_mime_types(fs_thumbnail_path)
      end

      private

      def fs_path
        File.join(fs_config.basedir, document.uuid, "#{uuid}.svg")
      end

      def fs_thumbnail_path
        File.join(fs_config.basedir, document.uuid, "#{uuid}.thumbnail.jpg")
      end

    end
  end
end
