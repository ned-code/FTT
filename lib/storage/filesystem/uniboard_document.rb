module Storage
  module Filesystem
    module UniboardDocument
      include Storage::Filesystem::Base

      def self.extended(base)
      end

      private

      def fs_basedir
        File.join(fs_config.basedir, uuid)
      end

      def save_payload
        return unless @tempfile

        @pages_to_delete_on_storage.each do |page_uuid|
        end
        @pages_to_delete_on_storage.clear

        Zip::ZipInputStream::open(@tempfile.path) do |file|
          while (entry = file.get_next_entry)
            next if entry.name =~ /\/$/ or entry.name == "#{uuid}.ub"

            File.makedirs(File.dirname(File.join(fs_basedir, *entry.name.split('/'))))

            File.open(File.join(fs_basedir, *entry.name.split('/')),  'w') do |fs_file|
              fs_file << file.read
            end
          end
        end

        @tempfile.close
        @tempfile = nil
      end

      def destroy_payload
      end

    end
  end
end
