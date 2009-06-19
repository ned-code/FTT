# Module that convert Uniboard desktop file to Uniboard WEB format.
class PdfConverter

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

      convert_command = convert_utility_path + " " + file + " " + options[:page] + " " + options[:width].to_s + " " + options[:height].to_s + " "  + options[:destination_path] + " " + destination_type
      puts convert_command
      unless system(convert_command)
        logger.debug "Error while generating image background"
        raise "Error while converting pdf #{file}"
      end
    else
      raise "Type not supported by converter. src: #{source_type}, dest: #{destination_type}"
    end
  end

  def convert(media, destination_type, options)

  end
end