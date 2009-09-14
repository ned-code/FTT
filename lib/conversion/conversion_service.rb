# To change this template, choose Tools | Templates
# and open the template in the editor.

module ConversionService

  @@converters = {}
  
  class Converter

    def convert_file(file, source_type, destination_type, options)
      raise NotImplementedError, "method convert_file is missing"
    end

    def convert_media(media, destination_type, options)
      tmp_media_file = File.join(options[:destination_path], "#{media.uuid}.tmp")
      File.open(tmp_media_file, 'wb') do |file|
          file << media.data.read()
      end
      converted_file_name = convert_file(tmp_media_file, media.media_type, destination_type, options)
      logger.debug "remove tmp file #{tmp_media_file}"
      FileUtils.remove_file(tmp_media_file)
      return converted_file_name
    end

    def supported_source_types
      raise NotImplementedError, "method supported_source_types is missing"
    end

    def supported_destination_type
      raise NotImplementedError, "method supported_destination_type is missing"
    end
  end

  def self.convert_file(file, source_type, destination_type, options)
    available_converter = converter_for(source_type, destination_type)
    raise "No corresponding converter found for source type #{media.media_type} and destination type #{destination_type}" if available_converter == nil
    available_converter.convert_file(file, source_type, destination_type, options)
  end

  def self.convert_media(media, destination_type, options)
    available_converter = converter_for(media.media_type, destination_type)
    raise "No corresponding converter found for source type #{media.media_type} and destination type #{destination_type}" if available_converter == nil
    available_converter.convert_media(media, destination_type, options)
  end

  def self.register_converter(converter)
    converter.supported_source_types.each do |a_source_type|
      @@converters[a_source_type] ||= {}
      converter.supported_destination_type.each do |a_destination_type|
        @@converters[a_source_type] [a_destination_type] = converter
      end
    end
  end

  def self.converter_for(source_type, destination_type)
    available_converter = @@converters[source_type]
    if (available_converter)
      available_converter = available_converter[destination_type]
    else
      available_converter = nil
    end
    return available_converter
  end
end
