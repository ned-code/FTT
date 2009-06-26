require 'conversion/conversion_service'

module ConversionService
  # Converter that convert Uniboard desktop file to Uniboard WEB format.
  class UbDocumentConverter < ConversionService::Converter

    def supported_source_types
      ["ub_document/ub"]
    end

    def supported_destination_type
      ["application/xhtml+xml"]
    end

    # convert ub_page and ub_document to html format
    # options must contain:
    # * :page_uuid for page conversion
    # * :document_uuid for document conversion
    # * :document_rdf_stream for document conversion
    # * :destination_path a path where to save conversion
    def convert_file(file, source_type, destination_type, options)
      destination_file = nil
      if (source_type == "ub_document/ub" && destination_type == supported_destination_type[0])
        html_content = convert_ub_document_to_html(options[:document_uuid], File.open(file), options[:document_rdf_stream])
        destination_file = "index.xhtml"
      else
        raise "Converter UbDocumentConverter does not support conversion from #{source_type} to #{destination_type}"
      end
      File.open(File.join(options[:destination_path], destination_file), 'w') do |html_file|
        html_file << html_content
      end
      raise "No output file has been created" if destination_file.nil?
      return destination_file
    end


    # Create the index.html file for a uniboard document
    # uuid is the uuid of the document to convert
    # ub_document_file is a stream to the .ub file that list all pages of the document
    # rdf_document_file is a stream to the rdf file of the document (metadata of the document)
    #
    # result is the index html content as a String
    def convert_ub_document_to_html(uuid, ub_document_file, rdf_document_file)
      ub_document_file.rewind
      rdf_document_file.rewind

      ub_document = XMLObject.new(ub_document_file)
      rdf_document = XMLObject.new(rdf_document_file)

      @html_document_builder = Builder::XmlMarkup.new(:indent => 2)

      @html_document_builder.declare! :DOCTYPE, :html, :PUBLIC, "-//W3C//DTD XHTML 1.0 Strict//EN", "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
      @html_document_builder.html("xmlns" => "http://www.w3.org/1999/xhtml") {
        @html_document_builder.head {
          @html_document_builder.title(rdf_document.Description.title)
          @html_document_builder.meta("http-equiv" => "Content-Type", "content" => "application/xhtml; charset=UTF-8")
          @html_document_builder.meta("name" => "uuid", "content" => uuid)
        }
        @html_document_builder.body {
          @html_document_builder.h1(rdf_document.Description.title, "id" => "ub_doc_title")
          @html_document_builder.div("id" => "ub_pages") {
            @html_document_builder.ul {
              if (ub_document.pages.is_a?(Array))
                ub_document.pages.each do |page|
                  add_page(page)
                end
              else
                page = ub_document.pages.page
                if (page.is_a?(Array))
                  page.each do |a_page|
                    add_page(a_page)
                  end
                else
                  add_page(page)
                end
              end
            }
          }
        }
      }
    end

    def add_page(svg_page)
      @html_document_builder.li {
        html_page = svg_page.gsub(".svg", ".xhtml")
        thumbnail_page = svg_page.gsub(".svg", ".thumbnail.jpg")
        @html_document_builder.a(html_page, "class" => "ub_page_link", "href" => html_page)
        @html_document_builder.img("class" => "ub_page_thumbnail", "src" => thumbnail_page, "alt" => "thumbnail")
      }
    end
  end
end

ConversionService::register_converter(ConversionService::UbDocumentConverter.new)