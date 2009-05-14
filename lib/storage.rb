module Storage
  module Base

    private

    def get_content_type_from_mime_types(filename)
      MIME::Types.of(File.extname(filename)).first.content_type
    rescue
      nil
    end

  end
end
