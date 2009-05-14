module Storage
  module S3
    module UniboardDocument
      include Storage::S3::Base

      def self.extended(base)
      end

      private

      def save_payload
        return unless @tempfile

        @pages_to_delete_on_storage.each do |page_uuid|
          s3_bucket.keys(:prefix => "documents/#{uuid}/#{page_uuid}").each do |key|
            key.delete
          end
        end
        @pages_to_delete_on_storage.clear

        Zip::ZipInputStream::open(@tempfile.path) do |file|
          while (entry = file.get_next_entry)
            next if entry.name =~ /\/$/ or entry.name == "#{uuid}.ub"
            s3_file_name = "documents/#{uuid}/#{entry.name}"
            s3_content_type = get_content_type_from_mime_types(s3_file_name)
            s3_file_access = s3_file_name =~ /#{UUID_FORMAT_REGEX}\.svg$/ ? 'private' : 'public-read'

            key = s3_bucket.key(s3_file_name)
            key.put(file.read, s3_file_access, 'content-type' => s3_content_type)
            key.refresh
          end
        end

        @tempfile.close
        @tempfile = nil
      end

      def destroy_payload
        s3_bucket.keys(:prefix => "documents/#{uuid}").each do |key|
          key.delete
        end
      end

    end
  end
end
