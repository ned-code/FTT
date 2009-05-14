module Storage
  module Filesystem
    module UniboardPage
      include Storage::Filesystem::Base

      def self.extended(base)
      end

      def url
        'http://uniboard.com'
      end

      def thumbnail_url
        'http://uniboard.com'
      end

    end
  end
end
