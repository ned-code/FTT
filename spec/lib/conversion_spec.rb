require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require "conversion/html_conversion"

describe "Uniboard document conversion" do

  before(:all) do
    document_zip_path = fixture_file(File.join('conversion', 'document.ubz'))
    @extracted_document_path = File.join(RAILS_ROOT, 'tmp', 'uncompressed_documents', File.basename(document_zip_path))
    Zip::ZipFile.foreach(document_zip_path) do |an_entry|
      #need to create sub folder if needed
      extracted_entry_path = File.join(@extracted_document_path, an_entry.name)
      if (!File.exist?(File.dirname(extracted_entry_path)))
        FileUtils.mkdir_p(File.dirname(extracted_entry_path))
      end
      an_entry.extract(File.join(@extracted_document_path, an_entry.name))
    end

    rdf_stream = File.open(@extracted_document_path + "/metadata.rdf")
    ub_stream = File.open(@extracted_document_path + "/00000000-0000-0000-0000-0000000.ub")
    @index_html = HtmlConversion::create_html_document("00000000-0000-0000-0000-0000000", ub_stream, rdf_stream)
    svg_stream = File.open(@extracted_document_path + "/page001.svg")
    @page_html = HtmlConversion::convert_svg_page_to_html("00000000-0000-0000-0000-0000001", svg_stream)

  end
    
  after(:all) do
    FileUtils.remove_dir(@extracted_document_path, true)
  end

  it "Document conversion should generate corresponding index.html file" do
    expected_result = File.open(fixture_file(File.join('conversion', 'index.html'))).read
    @index_html.should == expected_result
    
  end 


  it "Page conversion should generate page.xhtml with correct document size" do

     page = Hpricot(@page_html)     
     # uncomment to generate output on disk under spec/output_docuement
#     FileUtils.remove_dir(File.join(RAILS_ROOT, 'spec', 'output_document'), true)
#     FileUtils.mv(@extracted_document_path, File.join(RAILS_ROOT, 'spec', 'output_document'))
#     File.open(File.join(RAILS_ROOT, 'spec', 'output_document', 'page001.xhtml'), 'w') do |file|
#       file << @page_html
#     end
    correct_width = page.search("#ub_board")[0]['style'] =~ /width: 1438px/
    correct_height = page.search("#ub_board")[0]['style'] =~ /height: 2404px/
    correct_width.should > 0
    correct_height.should > 0
  end

  it "Page conversion should generate page.xhtml with corrersponding background" do

      page = Hpricot(@page_html)
      nb_background = 0
      background_elem = page.search("img") do |elem|
        if (elem['ub:background'] == "true")
          nb_background += 1
          elem['src'].should == "objects/{595af378-4481-488f-8cfa-d9b1d8e47ed3}00001.png"
        end
      end
      nb_background.should == 1
  end

  it "Page conversion should generate page.xhtml with corrersponding images" do

      page = Hpricot(@page_html)
      images_elem = page.search("img")
      images_elem.should have(3).items
  end

  it "Page conversion should generate page.xhtml with corrersponding text" do
    true
  end

  it "Page conversion should generate page.xhtml with corrersponding widgets" do

      page = Hpricot(@page_html)
      nb_widget = 0
      objects_elem = page.search("object") do |elem|
        if (elem['type'] == "text/html")
          nb_widget += 1
          elem['data'].should == "widgets/{5f5f7522-0f35-4c02-8cde-9ac2603f1325}.wdgt/ubGraph01.html"
        end
      end
      nb_widget.should == 1
  end
 
  it "Page conversion should generate page.xhtml with corrersponding drawing objects" do

      page = Hpricot(@page_html)
      svg_elem = page.search("svg:polygon")
      svg_elem.should have(915).items

  end

  it "Page conversion should generate page.xhtml with correct object position and size" do

      page = Hpricot(@page_html)
      correct_width = page.search("#b1cdc856-1400-4ac3-9c2b-29699b4fd94b")[0]['style'] =~ /width:694.04965px/
      correct_height = page.search("#b1cdc856-1400-4ac3-9c2b-29699b4fd94b")[0]['style'] =~ /height:981.00127px/
      correct_top = page.search("#b1cdc856-1400-4ac3-9c2b-29699b4fd94b")[0]['style'] =~ /top:711.499365px/
      correct_left = page.search("#b1cdc856-1400-4ac3-9c2b-29699b4fd94b")[0]['style'] =~ /left:371.975175px/
      correct_width.should > 0
      correct_height.should > 0
      correct_top.should > 0
      correct_left.should > 0
true
  end
end