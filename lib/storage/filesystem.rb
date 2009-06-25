require 'storage'
require 'fileutils'

module Storage
  class Filesystem < Storage::Base

    attr_reader :basedir

    def initialize(options)
      super

      @basedir = options[:basedir] || default_config['basedir'] || raise(ArgumentError, 'Filesystem basedir is not present in config Hash')
      @public_host_root_url = options[:public_host_root_url] || default_config['public_host_root_url'] || raise(ArgumentError, 'Filesystem public_host_root_url is not present in config Hash')
      RAILS_DEFAULT_LOGGER.debug "base dir #{@basedir}"
      RAILS_DEFAULT_LOGGER.debug "public host root URL #{@public_host_root_url}"
    end

    def put(path, data = '')
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      FileUtils.mkdir_p(File.dirname(full_path(path)))
      File.open(full_path(path), 'w') do |file|

        if data.is_a? String
          file << data
        else
          data.rewind
          file << data.read
        end

      end
    end

    def get(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      return nil unless exist?(path)

      if block_given?

        Tempfile.open(File.basename(path)) do |tempfile|
          tempfile << File.open(full_path(path)).read
          tempfile.rewind
          yield tempfile
        end

      else
        tempfile = Tempfile.new(File.basename(path))
        tempfile << File.open(full_path(path)).read
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
      return @public_host_root_url + "/" + path
    end

    def private_url(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)
      return "file://#{full_path(path)}"
    end

    def delete(path)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      return true unless exist?(path)

      begin
        File.delete(full_path(path))
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
