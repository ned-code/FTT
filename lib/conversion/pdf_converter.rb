require 'conversion/conversion_service'

module ConversionService

  class PdfConverter < ConversionService::Converter

    def supported_source_types
      ["application/pdf"]
    end

    def supported_destination_type
      ["image/png"]
    end

    # convert pdf document to image
    # options must contain:
    # * :page the page number that must be converted
    # * :width width of output image
    # * :height height of the output image
    # * :destination_path a path where to save conversion
    def convert_file(file, source_type, destination_type, options)
      if (source_type == "application/pdf" && destination_type == supported_destination_type[0])

        if (RUBY_PLATFORM =~ /linux/)
          convert_utility_path = File.join(RAILS_ROOT, 'lib', 'conversion', 'linux', 'pdf2image')
        elsif (RUBY_PLATFORM =~ /darwin/)
          convert_utility_path = File.join(RAILS_ROOT, 'lib', 'conversion', 'macx', 'pdf2image')
        end
        extension = "png"
        file_name_without_extension_matcher = File.basename(file).match(/.*\./)
        if (file_name_without_extension_matcher.nil?)
          file_name_without_extension_matcher = File.basename(file)
        elsif
          file_name_without_extension = file_name_without_extension_matcher[0][0..-2]
        end
        destination_file = File.join("#{file_name_without_extension}#{format("%05d", options[:page])}.#{extension}")
        convert_command = convert_utility_path + " " + file + " " + options[:page] + " " + options[:width].to_s + " " + options[:height].to_s + " "  + options[:destination_path] + " " + extension
        puts convert_command
        unless system(convert_command)
          logger.debug "Error while generating image background"
          raise "Error while converting pdf #{file}"
        end
        return destination_file
      else
        raise "Type not supported by converter. src: #{source_type}, dest: #{destination_type}"
      end
    end
  end
end

ConversionService::register_converter(ConversionService::PdfConverter.new)