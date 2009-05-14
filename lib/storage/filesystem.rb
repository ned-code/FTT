module Storage
  module Filesystem
    class Configuration

      attr_accessor :basedir

      def initialize(config = {})
        @basedir = config['basedir'] || File.join(RAILS_ROOT, 'files', 'documents')
      end

      def self.config
        @@config ||= Storage::Filesystem::Configuration.new
      end
    end

    module Base

      def fs_config
        Storage::Filesystem::Configuration.config
      end

    end
    
  end
end

require 'storage/filesystem/uniboard_document'
require 'storage/filesystem/uniboard_page'
