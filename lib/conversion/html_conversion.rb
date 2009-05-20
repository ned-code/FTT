

module HtmlConversion

  def self.create_html_document(uuid, ub_document_file, rdf_document_file)
    
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
            ub_document.pages.each do |page|
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
  
  def self.convert_svg_page_to_html(page_uuid, page_file_stream)
    page = XMLObject.new(page_file_stream)
    html_page_builder = Builder::XmlMarkup.new(:indent => 2)
    
    html_page_builder.declare! :DOCTYPE, :html, :PUBLIC, "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN", "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg-flat.dtd"
    html_page_builder.html("xmlns" => "http://www.w3.org/1999/xhtml", 
                               "xmlns:svg" => "http://www.w3.org/2000/svg", 
                               "xmlns:ub" => "http://www.mnemis.com/uniboard") {
        html_page_builder.head {
          html_page_builder.title(page[:attr => "ub:uuid"])
          html_page_builder.meta("http-equiv" => "Content-Type", "content" => "application/xhtml+xml; charset=UTF-8") 
          html_page_builder.script("type" => "text/javascript", "src" => "../../script/com/mnemis/wb/Viewer.js")        
        }
        
        html_page_builder.body {
          page_width = page.rect.width
          page_height = page.rect.height
          page_background = page.rect.fill
          html_page_builder.div("id" => "ub_board", "style" => "position: absolute; top: 0px; left: 0px; width: " + page_width + "px; height: " + page_height + "px; background-color:" + page_background) {
            
            # manage pdf background
            puts `date`
            
            # create drawing part
            html_page_builder.div("id" => "ub_page_drawing", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%") {
              # SVG root tag
              html_page_builder.tag!("svg:svg", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10000") {

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
              }   
            }
            # create objects part
            html_page_builder.div("id" => "ub_page_objects", "style" => "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%") {
              # add widgets
              if (page.foreignObject && page.foreignObject.is_a?(Array))
                page.foreignObject.each do |a_widget|
                  createHtmlWidget(html_page_builder, a_widget, page_width, page_height)                 
                end
              elsif (page.foreignObject)
                createHtmlWidget(html_page_builder, page.foreignObject, page_width, page_height)
              end                
                
              # add images
              if (page.image && page.image.is_a?(Array))
                page.image.each do |an_image|
                  createHtmlImage(html_page_builder, an_image, page_width, page_height)           
                end
              elsif (page.image)
                createHtmlImage(html_page_builder, page.image, page_width, page_height)
              end 
              
              # add text
              if (page.text && page.text.is_a?(Array))
                page.text.each do |a_text|
                  createHtmlText(html_page_builder, a_text, page_width, page_height)           
                end
              elsif (page.text)
                createHtmlText(html_page_builder, page.text, page_width, page_height)
              end                     
            }   
          }
        }
    }
    
  end
  
  private
  
  def self.getTransformMatrix(svg_object)
    if (svg_object.transform && svg_object.transform.length > 8)                              
      matrix_string = svg_object.transform                
      matrix = matrix_string[7..-2].split(", ")
    end
  end
  
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
      height = height * matrix[0].to_f
      left = left + matrix[4].to_f
      top = top + matrix[5].to_f
    end
    return { "left" => left, "top" => top, "width" => width, "height" => height, "z-index" => z_index}
  end
  
  def self.createHtmlText(page_builder, svg_object, page_width, page_height)
    size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = size_and_position["left"]
    top = size_and_position["top"]
    z_index = size_and_position["z-index"].to_i + 10000100
    width = size_and_position["width"]
    height = size_and_position["height"]  
    font_size = svg_object[:attr => "font-size"].to_f
    matrix = getTransformMatrix(svg_object)
    if (matrix && matrix[0])
      font_size = font_size * matrix[0].to_f
    end
    style = "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s
    style += "; font-size:" + font_size.to_s + "px"
    style += "; font-family:" + svg_object[:attr => "font-family"]
    style += "; color:" + svg_object[:attr => "fill"]
    
    uuid = svg_object[:attr => "ub:uuid"]
    if (!uuid)
      uuid |= UUID.new.generate
    end
    page_builder.div(svg_object, "id" => uuid,
                             "ub:background" => svg_object[:attr => "ub:background"],
                             "style" => style)
  end
  
  def self.createHtmlWidget(page_builder, svg_object, page_width, page_height)
    size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = size_and_position["left"]
    top = size_and_position["top"]
    z_index = size_and_position["z-index"].to_i + 10000100
    width = size_and_position["width"]
    height = size_and_position["height"]  
    page_builder.object("id" => svg_object[:attr => "ub:uuid"],
                             "type" => "text/html",
                             "data" => svg_object["iframe"].src,
                             "ub:background" => svg_object[:attr => "ub:background"],
                             "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
  end
  
  def self.createHtmlImage(page_builder, svg_object, page_width, page_height)
    size_and_position = getConvertedSizeAndPosition(svg_object, page_width, page_height)
    left = size_and_position["left"]
    top = size_and_position["top"]
    z_index = 0
    width = size_and_position["width"]
    height = size_and_position["height"]                
    if (svg_object[:attr => "ub:background"] == "true")
      z_index = size_and_position["z-index"].to_i + 20000001
    elsif
      z_index = size_and_position["z-index"].to_i + 10000100
    end
    # if image is an svg file we must create an object instead of an image in HTML.
    image_src = svg_object[:attr => "xlink:href"]
    if (image_src[-3,3] == "svg")
      page_builder.object("id" => svg_object[:attr => "ub:uuid"],
                               "type" => "image/svg+xml",
                               "data" => image_src,
                               "ub:background" => svg_object[:attr => "ub:background"],
                               "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
    else
      page_builder.img("id" => svg_object[:attr => "ub:uuid"],
                            "src" => image_src,
                            "alt" => "Image",
                            "ub:background" => svg_object[:attr => "ub:background"],
                            "style" => "position: absolute; left:" + left.to_s + "px; top:" + top.to_s + "px; width:" + width.to_s + "px; height:" + height.to_s + "px; z-index:" + z_index.to_s)
    end     
  end
end