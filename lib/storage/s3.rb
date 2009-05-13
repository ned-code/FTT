module Storage
  module S3
    class Configuration

      attr_reader :bucket_name

      def initialize(config = {})
        @access_key_id     = config['access_key_id']      || raise(ArgumentError, 'S3 access_key_id is not present in config Hash')
        @secret_access_key = config['secret_access_key']  || raise(ArgumentError, 'S3 secret_access_key is not present in config Hash')
        @bucket_name       = config['bucket']             || raise(ArgumentError, 'S3 bucket is not present in config Hash')
        @options           = config['options']            || {}

        @options.reverse_merge!({
            :logger => RAILS_DEFAULT_LOGGER
          })
      end

      def self.config(config = {})
        @@config ||= Storage::S3::Configuration.new(config)
      end

      def s3
        @s3 ||= RightAws::S3.new(@access_key_id, @secret_access_key, @options)
      end

      def bucket
        @bucket ||= s3.bucket(bucket_name, true)
      end
    end

    module Base

      def s3_config
        Storage::S3::Configuration.config(config.storage_config)
      end

      def s3
        s3_config.s3
      end

      def s3_bucket
        s3_config.bucket
      end

    end

  end
end

require 'storage/s3/uniboard_document'
require 'storage/s3/uniboard_page'
