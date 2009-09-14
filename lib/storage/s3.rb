require 'storage'

module Storage
  class S3 < Storage::Base

    DEFAULT_URL_EXPIRE_TIME = 5.minutes

    def initialize(options)
      super

      # Initialize connection
      connection(options[:connection_config])
      # get default bucket if not defined
      @options[:bucket] ||= default_config['bucket']
    end

    # Return a connection to s3
    def self.connection(config = nil)
      @@connection ||= {}

      identity_string = YAML.dump(config)
      if @@connection.has_key?(identity_string)
        @@connection[identity_string]
      else
        access_key_id     = config['access_key_id']      || raise(ArgumentError, 'S3 access_key_id is not present in config Hash')
        secret_access_key = config['secret_access_key']  || raise(ArgumentError, 'S3 secret_access_key is not present in config Hash')

        options           = config['options']            || {}
        options.reverse_merge!({
          :logger => logger
        })

        @@connection[identity_string] = RightAws::S3.new(access_key_id, secret_access_key, options)
      end
    end

   # Store data in 'path' key (if data is nil, the file content will be empty)
    def put(path, data = '')
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      data ||= '' # nil is equal to empty content

      key = bucket.key(path)
      begin
        if data.is_a? Hash
          data_path = data[:path]
          data_identity_string = data[:identity_string] || data[:storage_config]

          if identity_string == data_identity_string
            move(data_path, path)
            return true
          else
            data = Storage::storage(data_identity_string).get(data_path)
          end
        elsif !data.is_a?(String)
          data.rewind
        end
        s3_content_type = get_content_type_from_mime_types(path)
        s3_file_access =  'public-read'
        key.put(data, s3_file_access, 'content-type' => s3_content_type)
      rescue => e
        raise ArgumentError, "error on data: " + e.message
      end

      true
    end

    # Return data stream stored in 'path' key
    def get(path, &block)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      key = bucket.key(path)
      return nil unless key.exists?
      if block_given?
        Tempfile.open(File.basename(path)) do |tempfile|
          tempfile.binmode
          tempfile << key.data
          tempfile.rewind
          yield tempfile
        end

      else
        tempfile = Tempfile.new(File.basename(path))
        tempfile.binmode
        tempfile << key.data
        tempfile.rewind
        tempfile
      end
    end

    # Return true if data with 'path' key exist in storage
    def exist?(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      key = bucket.key(path)
      key.exists?
    end

    # Return public url for 'path' key (can be accessed worldwild)
    def public_url(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
#      key = bucket.key(path)
#      key.public_link
        "/files/#{path}"
    end

    # Return private url for 'path' key (can be accessed from application network)
    def private_url(path)
      public_url(path)
    end

    # Remove from storage data stored with 'path' key
    def delete(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      key = bucket.key(path)
      begin
        if (!key.exists?)
          bucket.delete_folder(path)
          return true
        end
        raise "File #{path} no deleted from s3 for unknown reason" unless key.delete
      rescue => e
        logger.error "Error when deleting file '#{path}' in Storage::S3: #{e.message}\n\n#{e.backtrace}"
        return false
      end

      true
    end

    # Move data from 'path' key to another
    def move(path_from, path_to)
      raise(ArgumentError, "path '#{path_from}' not be valid") unless valid_path?(path_from)
      raise(ArgumentError, "path '#{path_to}' not be valid") unless valid_path?(path_to)

      begin
        key = bucket.key(path_from)
        key.rename(path_to)
        grantee1 = RightAws::S3::Grantee.new(key, 'http://acs.amazonaws.com/groups/global/AllUsers', 'READ', :apply)
      rescue => e
        logger.error "Error when moving file '#{path_from}' to '#{path_to}' in Storage::S3: #{e.message}\n\n#{e.backtrace}"
        return false
      end

      true
    end

    private

    def connection(config = nil)
      @connection ||= self.class.connection(config || default_config['connection_config'])
    end

    def bucket
      s3_file_access =  'public-read'
      @bucket ||= connection.bucket(options[:bucket], false, s3_file_access)
    end

  end
end

#require 'storage/s3/document'
#require 'storage/s3/page'
