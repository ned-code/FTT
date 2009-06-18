require 'storage'
require 'fileutils'

module Storage
  class Filesystem < Storage::Base

    attr_reader :basedir

    def initialize(options)
      super

      @basedir = options[:basedir] || default_config['basedir'] || raise(ArgumentError, 'Filesystem basedir is not present in config Hash')
    end

    def put(path, data = '')
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      if data.kind_of?(IO) || data.kind_of?(Tempfile)
        data.rewind
        data = data.read
      end

      FileUtils.mkdir_p(File.dirname(full_path(path)))
      File.open(full_path(path), 'w') do |file|
        file << data
      end
    end

    def get(path, &block)
      raise(ArgumentError, "path '#{path}' not be valid") unless valid_path?(path)

      return nil unless exist?(path)

      if block_given?
        Tempfile.open(path) do |tempfile|

          tempfile << File.open(full_path(path)).read
          tempfile.rewind
          yield tempfile
        end
      else
        tempfile = Tempfile.new(path)
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
    end

    def private_url(path)
    end

    def delete(path)
    end

    def move(path_from, path_to)
    end

    private

    def full_path(path)
      File.join(basedir, path)
    end

  end
end
