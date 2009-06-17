require 'storage'

module Storage
  module Filesystem
    class Configuration

      attr_accessor :basedir

      def initialize(config = {})
        @basedir = config['basedir'] || File.join(RAILS_ROOT, 'public', 'documents')
      end

      def self.config
        @@config ||= Storage::Filesystem::Configuration.new
      end
    end

    module Base
      include Storage::Base

      private

      def fs_config
        Storage::Filesystem::Configuration.config
      end

    end
    
  end
end

require 'storage/filesystem/ub_document'
require 'storage/filesystem/ub_page'
