
# Module that convert Uniboard desktop file to Uniboard WEB format.
module HtmlConversion

  # Create the index.html file for a uniboard document
  # uuid is the uuid of the document to convert
  # ub_document_file is a stream to the .ub file that list all pages of the document
  # rdf_document_file is a stream to the rdf file of the document (metadata of the document)
  #
  # result is the index html content as a String
  def self.create_html_document(uuid, ub_document_file, rdf_document_file)
    ub_document_file.rewind
    rdf_document_file.rewind

    ub_document = XMLObject.new(ub_document_file)
    rdf_document = XMLObject.new(rdf_document_file)
    
    html_document_builder = Builder::XmlMarkup.new(:indent => 2)
    
    html_document_builder.declare! :DOCTYPE, :html, :PUBLIC, "-//W3C//DTD XHTML 1.0 Strict//EN", "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    html_document_builder.html("xmlns" => "http://www.w3.org/1999/xhtml") {
      html_document_builder.head {
        html_document_builder.title(rdf_document.Description.title)
        html_document_builder.meta("http-equiv" => "Content-Type", "content" => "application/xhtml; charset=UTF-8")
        html_document_builder.meta("name" => "uuid", "content" => uuid)
      }
      html_document_builder.body {
        html_document_builder.h1(rdf_document.Description.title, "id" => "ub_doc_title")
        html_document_builder.div("id" => "ub_pages") {
          html_document_builder.ul {
            if (ub_document.pages.is_a?(Array))          
              ub_document.pages.each do |page|
                html_document_builder.li {
                  html_page = page.gsub(".svg", ".xhtml")
                  thumbnail_page = page.gsub(".svg", ".thumbnail.jpg")                
                  html_document_builder.a(html_page, "class" => "ub_page_link", "href" => html_page)
                  html_document_builder.img("class" => "ub_page_thumbnail", "src" => thumbnail_page, "alt" => "thumbnail")
                }
              end
            elsif
              page = ub_document.pages.page
              html_document_builder.li {
                html_page = page.gsub(".svg", ".xhtml")
                thumbnail_page = page.gsub(".svg", ".thumbnail.jpg")                
                html_document_builder.a(html_page, "class" => "ub_page_link", "href" => html_page)
                html_document_builder.img("class" => "ub_page_thumbnail", "src" => thumbnail_page, "alt" => "thumbnail")
              }
            end
          }
        }
      }
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
  def self.convert_svg_page_to_html(page_uuid, page_file_stream) 
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
              # SVG root tag
              html_page_builder.tag!("svg:svg", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10000") {

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
                    html_page_builder.tag!("svg:polygon", "points" => translated_points, 
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
            }
            # create objects part
            html_page_builder.div("id" => "ub_page_objects", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%") {
              
              # add widgets
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                if (page.foreignObject && page.foreignObject.is_a?(Array))
                  page.foreignObject.each do |a_widget|
                    createHtmlForeignObject(html_page_builder, a_widget, page_width, page_height, page_file_stream)                 
                  end
                elsif (page.foreignObject)
                  createHtmlForeignObject(html_page_builder, page.foreignObject, page_width, page_height, page_file_stream)
                end
              rescue                
              end  
              
              # add images
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                if (page.image && page.image.is_a?(Array))
                  page.image.each do |an_image|
                    createHtmlImage(html_page_builder, an_image, page_width, page_height)           
                  end
                elsif (page.image)
                  createHtmlImage(html_page_builder, page.image, page_width, page_height)
                end
              rescue 
              end
              
              # add text
              # TODO: need to find out how to hande page without element of a certain type. Currently catch exception. But it also cathc other exception
              begin
                if (page.text && page.text.is_a?(Array))
                  page.text.each do |a_text|
                    createHtmlText(html_page_builder, a_text, page_width, page_height)           
                  end
                elsif (page.text)
                  createHtmlText(html_page_builder, page.text, page_width, page_height)
                end
              rescue => e
                RAILS_DEFAULT_LOGGER.debug(e.message)
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
  def self.getTransformMatrix(svg_object)
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
  def self.getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = svg_object.x.to_f + page_width.to_i / 2
    top = svg_object.y.to_f + page_height.to_i / 2
    z_index = svg_object[:attr => "ub:z-value"]
    width = svg_object.width.to_f
    height = svg_object.height.to_f   
    matrix = getTransformMatrix(svg_object)             
    # get the transform and modify top, left, width and height according to this transform
    if (matrix)                              
      width = width * matrix[0].to_f
      height = height * matrix[3].to_f
      left = (svg_object.x.to_f  * matrix[0].to_f) + page_width.to_i / 2
      top = (svg_object.y.to_f  * matrix[3].to_f) + page_height.to_i / 2
      left = left + matrix[4].to_f
      top = top + matrix[5].to_f
    end
    return { "left" => left, "top" => top, "width" => width, "height" => height, "z-index" => z_index}
  end
  
  
  # Convert a SVG text Element to an HTML text Element and append it to the HTML page file
  # page_builder is the XmlMarkup Builder of the html page. Used to append converted Element
  # svg_object is the XMLObject of the SVG Element
  # page_width is the width of the page
  # page_height is the height of the page 
  def self.createHtmlText(page_builder, svg_object, page_width, page_height)
    size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = size_and_position["left"]
    top = size_and_position["top"]
    z_index = size_and_position["z-index"].to_i
    width = size_and_position["width"]
    height = size_and_position["height"]  
    font_size = svg_object[:attr => "font-size"].to_f
    matrix = getTransformMatrix(svg_object)
    # TODO how to define font size if scale x and y scale are not equal
    if (matrix && matrix[0])
      font_size = font_size * matrix[0].to_f
    end
    style = "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s
    style += "; font-size:" + font_size.to_s + "px"
    style += "; font-family:" + svg_object[:attr => "font-family"]
    style += "; color:" + svg_object[:attr => "fill"]
    # SVG text object don't have UUID so we generate one
    uuid |= UUID.new.generate
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
  def self.createHtmlForeignObject(page_builder, svg_object, page_width, page_height, page_file_stream)
  
    # foreign object can be widgets or pdf background
    # if foreign is background, it should be a pdf background
    if (svg_object[:attr => "ub:background"] == "true")
      pdf_link = svg_object[:attr => "xlink:href"].split("#")
      pdf_url = pdf_link[0]
      pdf_page = pdf_link[1][5..-1]
      bg_width = svg_object[:attr => "width"].to_f
      bg_height = svg_object[:attr => "height"].to_f
      
      matrix = getTransformMatrix(svg_object)
      if (matrix && matrix[0])
        bg_width = bg_width * matrix[0].to_f
        bg_height = bg_height * matrix[3].to_f
      end
      
      if (RUBY_PLATFORM =~ /linux/)
        convertUtilityPath = File.join(RAILS_ROOT, 'lib', 'conversion', 'linux', 'pdf2image')
      elsif (RUBY_PLATFORM =~ /darwin/)
        convertUtilityPath = File.join(RAILS_ROOT, 'lib', 'conversion', 'macx', 'pdf2image')
      end
      image_format = "png"
      convert_command = convertUtilityPath + " " + File.dirname(page_file_stream.path) + "/" + pdf_url + " " + pdf_page + " " + bg_width.to_s + " " + bg_height.to_s + " "  + File.dirname(File.dirname(page_file_stream.path) + "/" + pdf_url) + " " + image_format
      puts convert_command
      if system(convert_command)
        left = (page_width.to_f - bg_width) / 2
        top = (page_height.to_f - bg_height) / 2
        page_builder.img("id" => svg_object[:attr => "ub:uuid"][1..-2],
                      "src" => pdf_url[0..-5] + format("%05d", pdf_page)  + "." + image_format,
                      "alt" => "Image",
                      "ub:background" => "true",
                      "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + bg_width.to_s + "px; height:" + bg_height.to_s + "px; z-index:-20000000")
      else
        logger.debug "Error while generating image background"
      end
      
    else
      size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
      left = size_and_position["left"]
      top = size_and_position["top"]
      z_index = size_and_position["z-index"].to_i
      width = size_and_position["width"]
      height = size_and_position["height"]  
      page_builder.object("id" => svg_object[:attr => "ub:uuid"][1..-2],
                               "type" => "text/html",
                               "data" => svg_object["iframe"].src,
                               "ub:background" => svg_object[:attr => "ub:background"],
                               "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
    end
  end
  
  
  # Convert a SVG image Element to an HTML Element and append it to the HTML page file.
  # page_builder is the XmlMarkup Builder of the html page. Used to append converted Element
  # svg_object is the XMLObject of the SVG Element
  # page_width is the width of the page
  # page_height is the height of the page  
  def self.createHtmlImage(page_builder, svg_object, page_width, page_height)
    size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = size_and_position["left"]
    top = size_and_position["top"]
    z_index = 0
    width = size_and_position["width"]
    height = size_and_position["height"]                
    if (svg_object[:attr => "ub:background"] == "true")
      z_index = size_and_position["z-index"].to_i
    elsif
      z_index = size_and_position["z-index"].to_i
    end
    # if image is an svg file we must create an object instead of an image in HTML.
    image_src = svg_object[:attr => "xlink:href"]
    if (image_src[-3,3] == "svg")
      page_builder.object("id" => svg_object[:attr => "ub:uuid"][1..-2],
                               "type" => "image/svg+xml",
                               "data" => image_src,
                               "ub:background" => svg_object[:attr => "ub:background"],
                               "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
    else
      page_builder.img("id" => svg_object[:attr => "ub:uuid"][1..-2],
                            "src" => image_src,
                            "alt" => "Image",
                            "ub:background" => svg_object[:attr => "ub:background"],
                            "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
    end     
  end
end