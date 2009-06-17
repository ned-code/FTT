module Storage
  module S3
    module UbDocument
      include Storage::S3::Base

      def self.extended(base)
      end

      protected

      def s3_key_name
        "documents/#{self.uuid}/index.html"
      end

      def save_payload
        return unless @document_zip_path

        @pages_to_delete_on_storage.each do |page_uuid|
          s3_bucket.keys(:prefix => "documents/#{uuid}/#{page_uuid}").each do |key|
            key.delete
          end
        end
        @pages_to_delete_on_storage.clear

        Find.find(@document_zip_path) do |path|
          if (path != @document_zip_path)
            if (!File.directory?(path))                        
              destination_name = path[@document_zip_path.length + 1..-1]
              if (!(destination_name =~ /\/$/ or destination_name == "#{uuid}.ub"))
                s3_file_name = "documents/#{uuid}/#{destination_name}"
                s3_content_type = get_content_type_from_mime_types(s3_file_name)
                s3_file_access = (destination_name =~ /#{UUID_FORMAT_REGEX}\.svg$/ || destination_name =~ /#{UUID_FORMAT_REGEX}\.xhtml$/ || destination_name == 'index.html') ? 'private' : 'public-read'
    
                key = s3_bucket.key(s3_file_name)
                key.put(File.open(path).read, s3_file_access, 'content-type' => s3_content_type)
              end
            end
          end
        end
        FileUtils.remove_dir(@document_zip_path, true)
        @document_zip_path = nil
        
#        Zip::ZipInputStream::open(@tempfile.path) do |file|
#          while (entry = file.get_next_entry)
#            next if entry.name =~ /\/$/ or entry.name == "#{uuid}.ub"
#            s3_file_name = "documents/#{uuid}/#{entry.name}"
#            s3_content_type = get_content_type_from_mime_types(s3_file_name)
#            s3_file_access = s3_file_name =~ /#{UUID_FORMAT_REGEX}\.svg$/ ? 'private' : 'public-read'
#
#            key = s3_bucket.key(s3_file_name)
#            key.put(file.read, s3_file_access, 'content-type' => s3_content_type)
#          end
#        end
#
#        @tempfile.close
#        @tempfile = nil
      end

      def destroy_payload
        s3_bucket.keys(:prefix => "documents/#{uuid}").each do |key|
          key.delete
        end
      end

    end
  end
end
