require 'storage'
require 'fileutils'

module Storage
  class Filesystem < Storage::Base

    def initialize(options)
      options[:basedir] ||= default_config['basedir'] || raise(ArgumentError, 'Filesystem basedir is not present in config Hash')
      options[:public_host_root_url] ||= default_config['public_host_root_url'] || raise(ArgumentError, 'Filesystem public_host_root_url is not present in config Hash')

      super(options)

      logger.debug "base dir #{basedir}"
      logger.debug "public host root URL #{public_host_root_url}"
    end

    def basedir
      options[:basedir]
    end

    def public_host_root_url
      options[:public_host_root_url]
    end

    def put(path, data = '')
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      data ||= '' # nil is equal to empty content

      if data.is_a? Hash
        data_path = data[:path]
        data_identity_string = data[:identity_string] || data[:storage_config]

        if identity_string == data_identity_string
          return move(data_path, path)
        end
      end

      FileUtils.mkdir_p(File.dirname(full_path(path)))
      File.open(full_path(path), 'wb') do |file|

        begin
          if data.is_a? String
            file << data
          elsif data.is_a? Hash
            data_path = data[:path]
            data_identity_string = data[:identity_string] || data[:storage_config]

            file << Storage::storage(data_identity_string).get(data_path).read
          elsif data.is_a? Zip::ZipInputStream
            file << data.read
          else
            if (data.closed?)
              data = File.open(data.path, 'rb')
            end
            data.rewind
            file << data.read
            data.close
          end
        rescue => e
          raise ArgumentError, "invalid data: " + e.message
        end

      end

      true
    end

    def get(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      return nil unless exist?(path)

      if block_given?

        Tempfile.open(File.basename(path)) do |tempfile|
          tempfile.binmode
          opened_file = File.open(full_path(path), 'rb')
          tempfile << opened_file.read
          opened_file.close
          tempfile.rewind
          yield tempfile
        end

      else
        tempfile = Tempfile.new(File.basename(path))
        tempfile.binmode
        opened_file = File.open(full_path(path), 'rb')
        tempfile << opened_file.read
        opened_file.close
        tempfile.rewind
        tempfile
      end
    end

    def exist?(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      File.exist?(full_path(path))
    end

    def public_url(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      return public_host_root_url + "/" + path
    end

    def private_url(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      return "file://#{full_path(path)}"
    end

    def delete(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      return true unless exist?(path)

      begin
        FileUtils.remove_entry(full_path(path))
        rm_empty_directories(path)
      rescue => e
        logger.error "Error when deleting file '#{path}' in Storage::Filesystem: #{e.message}\n\n#{e.backtrace}"
        return false
      end

      true
    end

    def move(path_from, path_to)
      raise(ArgumentError, "path '#{path_from}' not be valid") unless valid_path?(path_from)
      raise(ArgumentError, "path '#{path_to}' not be valid") unless valid_path?(path_to)

      begin
        FileUtils.mkdir_p(File.dirname(full_path(path_to)))
        File.rename(full_path(path_from), full_path(path_to))
        rm_empty_directories(path_from)
      rescue => e
        rm_empty_directories(path_to)
        logger.error "Error when moving file '#{path_from}' to '#{path_to}' in Storage::Filesystem: #{e.message}\n\n#{e.backtrace}"
        return false
      end

      true
    end

    private

    def full_path(path)
      path = File.join(basedir, path)  if path !~ /^\/.+/    # Add basedir to path if not absolute
      path = File.join(RAILS_ROOT, path) if path !~ /^\/.+/  # Add RAILS_ROOT to path if basedir is not absolute
      path
    end

    # Remove all empty diretories in path down to 'basedir's
    def rm_empty_directories(path)
      Pathname.new(full_path(path)).ascend do |e|
        break if e.to_s =~ /#{basedir}$/

        if e.directory? && e.entries.size <= 2
          e.delete
        end

      end
    end

  end
end
