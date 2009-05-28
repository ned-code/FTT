module Storage
  module Filesystem
    module UniboardPage
      include Storage::Filesystem::Base

      def self.extended(base)
      end

      def url(format = "svg", request_domain = nil)
        if (request_domain)
          "#{request_domain}#{relative_path(format)}"
        else
          "file://#{fs_path(format)}"
        end
      end

      def mime_type(format = "svg")
        get_content_type_from_mime_types(fs_path(format))
      end

      def thumbnail_url(request_domain = nil)
        if (request_domain)
          "#{request_domain}#{relative_thumbnail_path}"
        else
          "file://#{fs_thumbnail_path}"
        end
      end

      def thumbnail_mime_type
        get_content_type_from_mime_types(fs_thumbnail_path)
      end

      private

      def relative_path(format = "svg")
        "/documents/#{document.uuid}/#{uuid}.#{format}"
      end

      def fs_path(format = "svg")
        File.join(fs_config.basedir, document.uuid, "#{uuid}.#{format}")
      end

      def relative_thumbnail_path
        "/documents/#{document.uuid}/#{uuid}.thumbnail.jpg"
      end

      def fs_thumbnail_path
        File.join(fs_config.basedir, document.uuid, "#{uuid}.thumbnail.jpg")
      end

    end
  end
end
