# To change this template, choose Tools | Templates
# and open the template in the editor.

module ConversionService

  # all available converters are stored in this map.
  # Keys are source type and value is a map with keys destination type and value equal to converter object
  @@converters = {}

  def self.convert_file(file, source_type, destination_type, options)
    available_converter = converter_for(source_type, destination_type)
    raise "No corresponding converter found for source type #{media.type} and destination type #{destination_type}" if available_converter == nil
    available_converter.convert_file(file, source_type, destination_type, options)
  end

  def self.convert_media(media, destination_type, options)
    available_converter = converter_for(media.type, destination_type)
    raise "No corresponding converter found for source type #{media.type} and destination type #{destination_type}" if available_converter == nil
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

  private

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
