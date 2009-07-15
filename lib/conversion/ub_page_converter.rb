require 'conversion/conversion_service'

module ConversionService
  # Converter that convert Uniboard desktop file to Uniboard WEB format.
  class UbPageConverter < ConversionService::Converter

    def supported_source_types
      ['application/vnd.mnemis-uniboard-page']
    end

    def supported_destination_type
      ["application/xhtml+xml", 'application/vnd.mnemis-uniboard-drawing']
    end

    # convert ub_page and ub_document to html format
    # options must contain:
    # * :page_uuid for page conversion
    # * :document_uuid for document conversion
    # * :document_rdf_stream for document conversion
    # * :destination_path a path where to save conversion
    def convert_file(file, source_type, destination_type, options)
      destination_file = nil
      opened_file = File.open(file,'rb')
      if (source_type == supported_source_types[0] && destination_type == supported_destination_type[0])
        file_content = convert_svg_page_to_html(options[:page_uuid], opened_file)
        page_base_name = File.basename(file).match(/.*\./)[0]
        destination_file = "#{page_base_name}xhtml"
      elsif (source_type == supported_source_types[0] && destination_type == supported_destination_type[1])
        file_content = convert_svg_page_to_svg_drawing(opened_file)
        page_base_name = File.basename(file).match(/.*\./)[0]
        destination_file = "#{page_base_name}drawing.svg"
      else
        opened_file.close()
        raise "Converter UbPageConverter does not support conversion from #{source_type} to #{destination_type}"
      end
      opened_file.close()
      File.open(File.join(options[:destination_path], destination_file), 'wb') do |html_file|
        html_file << file_content
      end
      raise "No output file has been created" if destination_file.nil?
      return destination_file
    end

    def convert_media(media, destination_type, options)
      tmp_media_file = File.join(options[:destination_path], "#{media.uuid}.tmp")
      File.open(tmp_media_file, 'wb') do |file|
        file << media.data.read()
      end
      options[:page_uuid] = media.uuid
      converted_file_name = convert_file(tmp_media_file, media.media_type, destination_type, options)
      RAILS_DEFAULT_LOGGER.debug "remove tmp file #{tmp_media_file}"
      FileUtils.remove_file(tmp_media_file)
      return converted_file_name
    end

    def convert_svg_page_to_svg_drawing(page_file_stream)
      page_file_stream.rewind
      RAILS_DEFAULT_LOGGER.debug "convert drawing..."
      page = XMLObject.new(page_file_stream)
      page_width = page.rect.width
      page_height = page.rect.height
      svg_drawing_builder = Builder::XmlMarkup.new(:indent => 2)
      # SVG root tag
      svg_drawing_builder.instruct!
      svg_drawing_builder.tag!("svg", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%", "xmlns" => "http://www.w3.org/2000/svg",
        "xmlns:xlink" => "http://www.w3.org/1999/xlink", "xmlns:ub" => "http://st-ub.mnemis.com/document") {

        # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
        begin
          page.polygon.each do |current_polygon|
            # translate points coordinates because 0 is centered in desktop format and in html 0 is the upper left corner.
            translated_points = ""
            points = current_polygon.points.split
            points.each do |aPoint|
              coordinates = aPoint.split(',')
              x_point = coordinates[0].to_f + page_width.to_i / 2
              translated_points += x_point.to_s
              translated_points += ","
              y_point = coordinates[1].to_f + page_height.to_i / 2
              translated_points += y_point.to_s
              translated_points += " "
            end
            svg_drawing_builder.tag!("polygon", "points" => translated_points,
              "fill" => current_polygon.fill,
              "fill-opacity" => current_polygon[:attr => "fill-opacity"],
              "z-index" => current_polygon[:attr => "ub:z-value"],
              "ub:fill-on-dark-background" => current_polygon[:attr => "ub:fill-on-dark-background"],
              "ub:fill-on-light-background" => current_polygon[:attr => "ub:fill-on-light-background"]
            )
          end
        rescue
        end
      }
    end
    
    # Create a page html file based on the svg file of the page.
    # page_uuid is the uuid of the page to convert
    # page_file_stream if a stream to the page svg file
    #
    # return the page html file content as a String
    #
    # This function assume that related files are accesible relatively from the svg file. Typically a pdf background file will be converted to
    # a png file so the pdf file must be accessible on the Hard drive.
    # PDF background is converted to a png file and this png file is placed beside the pdf background file.
    def convert_svg_page_to_html(page_uuid, page_file_stream)
      page_file_stream.rewind
      RAILS_DEFAULT_LOGGER.debug "convert page #{page_uuid}"
      page = XMLObject.new(page_file_stream)
      html_page_builder = Builder::XmlMarkup.new(:indent => 2)

      html_page_builder.declare! :DOCTYPE, :html, :PUBLIC, "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN", "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg-flat.dtd"
      html_page_builder.html("xmlns" => "http://www.w3.org/1999/xhtml",
        "xmlns:svg" => "http://www.w3.org/2000/svg",
        "xmlns:ub" => XML_UNIBOARD_DOCUMENT_NAMESPACE) {
        html_page_builder.head {
          html_page_builder.title(page_uuid)
          html_page_builder.meta("http-equiv" => "Content-Type", "content" => "application/xhtml+xml; charset=UTF-8")
        }

        html_page_builder.body {
          page_width = page.rect.width
          page_height = page.rect.height
          page_background = page.rect.fill
          html_page_builder.div("id" => "ub_board", "style" => "position: absolute; top: 0px; left: 0px; width: " + page_width + "px; height: " + page_height + "px; background-color:" + page_background + "; z-index:-2000000") {

            # create drawing part
            html_page_builder.div("id" => "ub_page_drawing", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%") {
              #get drawing object for current page
              page_media = UbMedia.find_by_uuid(page_uuid)
              drawing_resource = page_media.get_resource('application/vnd.mnemis-uniboard-drawing', {})
              html_page_builder.object("type" => "image/svg+xml","data" => drawing_resource.public_url,
                "style" => "position: absolute; top: 0px; left: 0px; width: " + page_width + "px; height: " + page_height + "px; z-index: 1999999")
              # put another element at same index to catch mouse events. Otherwise SVG object catch them and does not propagate them
              html_page_builder.div(
                "style" => "position: absolute; top: 0px; left: 0px; width: " + page_width + "px; height: " + page_height + "px; z-index: 1999999")
            }
            # create objects part
            html_page_builder.div("id" => "ub_page_objects", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%") {

              # add widgets
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                RAILS_DEFAULT_LOGGER.debug "find foreign objects"
                if (page.foreignObject && page.foreignObject.is_a?(Array))
                  RAILS_DEFAULT_LOGGER.debug "multiple foreign objects"
                  page.foreignObject.each do |a_widget|
                    create_html_foreign_object(html_page_builder, a_widget, page_width, page_height, page_file_stream)
                  end
                elsif (page.foreignObject)
                  RAILS_DEFAULT_LOGGER.debug "1 foreign objects"
                  create_html_foreign_object(html_page_builder, page.foreignObject, page_width, page_height, page_file_stream)
                end
              rescue => e
                RAILS_DEFAULT_LOGGER.debug(e.message)
              end

              # add images
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                if (page.image && page.image.is_a?(Array))
                  page.image.each do |an_image|
                    create_html_image(html_page_builder, an_image, page_width, page_height)
                  end
                elsif (page.image)
                  create_html_image(html_page_builder, page.image, page_width, page_height)
                end
              rescue => e
                RAILS_DEFAULT_LOGGER.debug(e.message)
                RAILS_DEFAULT_LOGGER.debug(e.backtrace.join("\n"))
              end

              # add text
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                if (page.text && page.text.is_a?(Array))
                  page.text.each do |a_text|
                    create_html_text(html_page_builder, a_text, page_width, page_height)
                  end
                elsif (page.text)
                  create_html_text(html_page_builder, page.text, page_width, page_height)
                end
              rescue => e
                RAILS_DEFAULT_LOGGER.debug(e.message)
                RAILS_DEFAULT_LOGGER.debug(e.backtrace.join("\n"))
              end
            }
          }
        }
      }

    end



    private

    # Return the transform matrix assicited to an SVG element.
    # svg_object is the XMLObject of the SVG Element
    #
    # return an array with [m11, m12, m21, m22, m31, m32]
    def get_transform_matrix(svg_object)
      if (svg_object.transform && svg_object.transform.length > 8)
        matrix_string = svg_object.transform
        matrix = matrix_string[7..-2].split(", ")
      end
    end


    # Return all converted position and size for a SVG Element.
    # svg_object is the XMLObject of the SVG Element
    # page_width is the width of the page
    # page_height is the height of the page
    #
    # Return a Hash with { left => ..., top => ..., width => ..., height => ..., z-index => ...}
    def get_converted_size_and_position(svg_object, page_width, page_height)
      left = svg_object.x.to_f + page_width.to_i / 2
      top = svg_object.y.to_f + page_height.to_i / 2
      z_index = svg_object[:attr => "ub:z-value"]
      width = svg_object.width.to_f
      height = svg_object.height.to_f
      matrix = get_transform_matrix(svg_object)      
#      get the transform and modify top, left, width and height according to this transform
#      if (matrix)
#        width = width * matrix[0].to_f
#        height = height * matrix[3].to_f
#        left = (svg_object.x.to_f  * matrix[0].to_f) + page_width.to_i / 2
#        top = (svg_object.y.to_f  * matrix[3].to_f) + page_height.to_i / 2
#        left = left + matrix[4].to_f
#        top = top + matrix[5].to_f
#      end
      return { "left" => left, "top" => top, "width" => width, "height" => height, "z-index" => z_index, "matrix" => string_matrix(matrix)}
    end

    def string_matrix(matrix)
      result = "-moz-transform: matrix(#{matrix[0]}, #{matrix[1]}, #{matrix[2]}, #{matrix[3]}, #{matrix[4]}px, #{matrix[5]}px)"
      result += "; -moz-transform-origin: 0 0"
      result += "; -webkit-transform: matrix(#{matrix[0]}, #{matrix[1]}, #{matrix[2]}, #{matrix[3]}, #{matrix[4]}, #{matrix[5]})"
      result += "; -webkit-transform-origin: 0 0"
      result += "; filter: progid:DXImageTransform.Microsoft.Matrix(M11 = '#{matrix[0]}', M12 = '#{matrix[1]}', M21 = '#{matrix[2]}', M22 = '#{matrix[3]}', Dx = '#{matrix[4]}', Dy = '#{matrix[5]}', SizingMethod = 'auto expand')"
    end

    def style_position(svg_object, page_width, page_height)
      size_and_position = get_converted_size_and_position(svg_object, page_width, page_height)
      left = size_and_position["left"]
      top = size_and_position["top"]
      z_index = size_and_position["z-index"].to_i
      width = size_and_position["width"]
      height = size_and_position["height"]
      result ="position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:"
      result += z_index.to_s + "; " + size_and_position["matrix"]
    end

    # Convert a SVG text Element to an HTML text Element and append it to the HTML page file
    # page_builder is the XmlMarkup Builder of the html page. Used to append converted Element
    # svg_object is the XMLObject of the SVG Element
    # page_width is the width of the page
    # page_height is the height of the page
    def create_html_text(page_builder, svg_object, page_width, page_height)
      font_size = svg_object[:attr => "font-size"].to_f
      matrix = get_transform_matrix(svg_object)
      # TODO how to define font size if scale x and y scale are not equal
      if (matrix && matrix[0])
        font_size = font_size * matrix[0].to_f
      end
      style = style_position(svg_object, page_width, page_height)
      style += "; font-size:" + font_size.to_s + "px"
      style += "; font-family:" + svg_object[:attr => "font-family"]
      style += "; color:" + svg_object[:attr => "fill"]
      # SVG text object don't have UUID so we generate one
      uuid = UUID.generate
      page_builder.div(svg_object, "id" => uuid,
        "ub:background" => svg_object[:attr => "ub:background"],
        "style" => style)
    end


    # Convert a SVG Foreign object Element to an HTML Element and append it to the HTML page file. Foreign object can be Widgets or PDF background
    # page_builder is the XmlMarkup Builder of the html page. Used to append converted Element
    # svg_object is the XMLObject of the SVG Element
    # page_width is the width of the page
    # page_height is the height of the page
    # page_file_stream is the stream on the SVG page file. It is used to find relative pdf background and convert it.
    def create_html_foreign_object(page_builder, svg_object, page_width, page_height, page_file_stream)

      # foreign object can be widgets or pdf background
      # if foreign is background, it should be a pdf background
      if (svg_object[:attr => "ub:background"] == "true")
        RAILS_DEFAULT_LOGGER.debug "find background foreign objects"
        pdf_link = svg_object[:attr => "xlink:href"].split("#")
        pdf_url = pdf_link[0]
        pdf_page = pdf_link[1][5..-1]
        bg_width = svg_object[:attr => "width"].to_f
        bg_height = svg_object[:attr => "height"].to_f

        matrix = get_transform_matrix(svg_object)
        if (matrix && matrix[0])
          bg_width = bg_width * matrix[0].to_f
          bg_height = bg_height * matrix[3].to_f
        end
        pdf_media_uuid = svg_object[:attr => "xlink:href"].match(UUID_FORMAT_REGEX)[0]
        RAILS_DEFAULT_LOGGER.debug "search for uuid #{pdf_media_uuid}"
        pdf_media = UbMedia.find_by_uuid(pdf_media_uuid)
        RAILS_DEFAULT_LOGGER.debug "found media #{pdf_media}"
        raise "Missing pdf media with id #{pdf_media_uuid}" unless pdf_media
        RAILS_DEFAULT_LOGGER.debug "pdf media is #{pdf_media.path}"
        page_background_ressource = pdf_media.get_resource("image/png", {:page => pdf_page, :width => bg_width, :height => bg_height})

        left = (page_width.to_f - bg_width) / 2
        top = (page_height.to_f - bg_height) / 2
        page_builder.img("id" => svg_object[:attr => "ub:uuid"].match(UUID_FORMAT_REGEX)[0],
          "src" => page_background_ressource.public_url(),
          "alt" => "Image",
          "ub:background" => "true",
          "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + bg_width.to_s + "px; height:" + bg_height.to_s + "px; z-index:-20000000")
      else

        begin
          if (svg_object[:attr => "ub:type"] == "text")
            font_object = svg_object.body.div.font
            font_xml = font_object.raw_xml().to_s.gsub("xhtml:","")
            page_builder.div("id" => svg_object[:attr => "ub:uuid"].match(UUID_FORMAT_REGEX)[0],
              "style" => style_position(svg_object, page_width, page_height)){

              |x| x << font_xml
            }
          end
        rescue => e
          widget_uuid = svg_object[:attr => "ub:uuid"].match(UUID_FORMAT_REGEX)[0]
          widget_media = UbMedia.find_by_uuid(widget_uuid)
          raise "Media missing for uuid #{widget_uuid}" if widget_media.nil?
          widget_page_file = svg_object["iframe"].src.gsub(svg_object[:attr => "ub:src"], "")
          page_builder.object("id" => widget_uuid,
            "type" => "text/html",
            "data" => File.join(widget_media.public_url, widget_page_file),
            "ub:background" => svg_object[:attr => "ub:background"],
            "style" => style_position(svg_object, page_width, page_height))
        end
      end
    end


    # Convert a SVG image Element to an HTML Element and append it to the HTML page file.
    # page_builder is the XmlMarkup Builder of the html page. Used to append converted Element
    # svg_object is the XMLObject of the SVG Element
    # page_width is the width of the page
    # page_height is the height of the page
    def create_html_image(page_builder, svg_object, page_width, page_height)

      image_uuid = svg_object[:attr => "ub:uuid"].match(UUID_FORMAT_REGEX)[0]

      image_media = UbMedia.find_by_uuid(image_uuid)
      raise "Media missing for uuid #{image_uuid}" if image_media.nil?

      # if image is an svg file we must create an object instead of an image in HTML.
      image_src = svg_object[:attr => "xlink:href"]
      if (image_src[-3,3] == "svg")
        page_builder.object("id" => image_uuid,
          "type" => "image/svg+xml",
          "data" => image_media.public_url,
          "ub:background" => svg_object[:attr => "ub:background"],
          "style" => style_position(svg_object, page_width, page_height))
      else
        page_builder.img("id" => image_uuid,
          "src" => image_media.public_url,
          "alt" => "Image",
          "ub:background" => svg_object[:attr => "ub:background"],
          "style" => style_position(svg_object, page_width, page_height))
      end
    end
  end
end

ConversionService::register_converter(ConversionService::UbPageConverter.new)