require 'yaml'

module Storage

  # Can receive Hash with a ':name' of storage and another options for storage
  # initialization, or identity string (Marsahl dump format, be returned by Storage#to_s)
  def self.storage(options)
    @@storages ||= {}

    begin
      options = {:name => :filesystem} if options == nil
      options = YAML.load(options) if options.is_a?(String)
    rescue
      raise ArgumentError, "'options' can't be converted from YAML to Hash"
    end
    raise(ArgumentError, "'options' must be a Hash or YAML dump") unless options.kind_of?(Hash)
    raise(ArgumentError, "missing 'name' attribute in 'options' argument") unless options.has_key?(:name)

    identity_string = YAML.dump(options)
    if @@storages.has_key?(identity_string)
      @@storages[identity_string]
    else
      begin
        storage_class = Storage.const_get(options[:name].to_s.capitalize)
      rescue
        raise(ArgumentError, "storage '#{options[:name].to_s}' can't be loaded")
      end
      @@storages[identity_string] = storage_class.new(options)
    end
  end

  class Base
    attr_reader :options

    def initialize(options)
      @options = options
    end

    def identity_string
      YAML.dump(options)
    end

    # Return identiy string (wshich can be passed as argument to Storage.storage)
    alias_method :to_s, :identity_string

    # Return sotrage name symbol
    def name
      @name ||= self.class.name.downcase.split(/::/).last.to_sym
    end

    # Store data in 'path' key (if data is nil, the file content will be empty)
    def put(path, data = nil)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Return data stream stored in 'path' key
    def get(path, &block)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Return true if data with 'path' key exist in storage
    def exist?(path)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Return public url for 'path' key (can be accessed worldwild)
    def public_url(path)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Return private url for 'path' key (can be accessed from application network)
    def private_url(path)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Remove from storage data stored with 'path' key
    def delete(path)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    # Move data from 'path' key to another
    def move(path_from, path_to)
      raise NotImplementedError, "Must be implemented in the '#{name}' storage type"
    end

    private

    def default_config
      config_path = File.join(RAILS_ROOT, 'config', 'storage', "#{name}.yml")
      config_by_default_path = File.join(RAILS_ROOT, 'config', 'storage', "#{name}.default.yml")

      begin
        @default_config ||= YAML::load_file(File.exist?(config_path) ? config_path : config_by_default_path)[RAILS_ENV]
      rescue
        raise StandardError, "Configuration file '#{config_path}' for storage doesn't exist or have right information about Rails '#{RAILS_ENV}' environement."
      end
    end

    def valid_path?(path)
      path !~ /^\/.+/
    end

    def logger
      @logger ||= Rails.logger
    end

    # TODO: remove if not used after refactoring
    def get_content_type_from_mime_types(filename)
      MIME::Types.of(File.extname(filename)).first.content_type
    rescue
      nil
    end
  end
end
