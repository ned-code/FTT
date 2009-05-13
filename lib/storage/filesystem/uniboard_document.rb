module Storage
  module Filesystem
    module UniboardDocument
      include Storage::Filesystem::Base

      def self.extended(base)
      end

      def save_payload
      end

      def destroy_payload
      end
      
    end
  end
end
