module Storage
  module Filesystem
    module UbDocument
      include Storage::Filesystem::Base

      def self.extended(base)
      end
      
      private

      def fs_basedir
        File.join(fs_config.basedir, uuid)
      end

      def save_payload
        return unless @document_zip_path

        @pages_to_delete_on_storage.each do |page_uuid|
          Dir[File.join(fs_basedir, "#{page_uuid}*")].each do |file|
            File.delete(file)
          end
        end
        @pages_to_delete_on_storage.clear

        # create document folder if needed
        if (!File.exist?(fs_basedir))
          FileUtils.mkdir_p(fs_basedir)
        end
        Find.find(@document_zip_path) do |path|
          if (path != @document_zip_path)
            destination_name = File.basename(path)
            FileUtils.copy_entry(path, File.join(fs_basedir, destination_name))
            if (File.directory?(path))                        
              Find.prune
            end
          end
        end
        FileUtils.remove_dir(@document_zip_path, true)
        @document_zip_path = nil
        
      end

      def destroy_payload
        FileUtils.rm_rf(fs_basedir)
      end

    end
  end
end
