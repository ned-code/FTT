require 'storage'

module Storage
  class S3 < Storage::Base

    DEFAULT_URL_EXPIRE_TIME = 5.minutes

    def initialize(options)
      super

      # Initialize connection
      connection(options[:connection_config])
    end

    # Return a connection to s3
    def self.connection(config = nil)
      begin
        config ||= YAML::load_file(File.join(RAILS_ROOT, 'config', 'storage', 's3.yml'))[RAILS_ENV]['connection_config']
      rescue
        raise StandardError, "Configuration file '#{File.join(RAILS_ROOT, 'config', 's3.yml')}' for S3 storage doesn't exist or have right information about Rails '#{RAILS_ENV}' environement."
      end

      @@connection ||= {}

      identity_string = Marshal.dump(config)
      if @@connection.has_key?(identity_string)
        @@connection[identity_string]
      else
        access_key_id     = config['access_key_id']      || raise(ArgumentError, 'S3 access_key_id is not present in config Hash')
        secret_access_key = config['secret_access_key']  || raise(ArgumentError, 'S3 secret_access_key is not present in config Hash')

        options           = config['options']            || {}
        options.reverse_merge!({
          :logger => RAILS_DEFAULT_LOGGER
        })

        @@connection[identity_string] = RightAws::S3.new(access_key_id, secret_access_key, options)
      end
    end

    def put(path, data = nil)

    end

    private

    def connection(config = nil)
      @connection ||= self.class.connection(config)
    end
    
  end
end

#require 'storage/s3/ub_document'
#require 'storage/s3/ub_page'
