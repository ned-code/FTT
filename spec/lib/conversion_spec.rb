#require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
#require "conversion/html_converter"
#
#describe "Uniboard document conversion" do
#
#  before(:all) do
#    document_zip_path = fixture_file(File.join('conversion', 'document.ubz'))
#    @extracted_document_path = File.join(RAILS_ROOT, 'tmp', 'uncompressed_documents', File.basename(document_zip_path))
#    Zip::ZipFile.foreach(document_zip_path) do |an_entry|
#      #need to create sub folder if needed
#      extracted_entry_path = File.join(@extracted_document_path, an_entry.name)
#      if (!File.exist?(File.dirname(extracted_entry_path)))
#        FileUtils.mkdir_p(File.dirname(extracted_entry_path))
#      end
#      an_entry.extract(File.join(@extracted_document_path, an_entry.name))
#    end
#    rdf_stream = File.open(@extracted_document_path + "/metadata.rdf")
#    ub_stream = File.open(@extracted_document_path + "/00000000-0000-0000-0000-0000000.ub")
#    @index_html = HtmlConvertion::create_html_document("00000000-0000-0000-0000-0000000", ub_stream, rdf_stream)
#    svg_stream = File.open(@extracted_document_path + "/page001.svg")
#    @page_html = HtmlConvertion::convert_svg_page_to_html("00000000-0000-0000-0000-0000001", svg_stream)
#
#  end
#
#  after(:all) do
#    FileUtils.remove_dir(@extracted_document_path, true)
#  end
#
#  it "Document conversion should generate corresponding index.html file" do
#    expected_result = File.open(fixture_file(File.join('conversion', 'index.html'))).read
#    @index_html.should == expected_result
#
#  end
#
#
#  it "Page conversion should generate page.xhtml with correct document size" do
#
#     page = Hpricot(@page_html)
#     # uncomment to generate output on disk under spec/output_docuement
##     FileUtils.remove_dir(File.join(RAILS_ROOT, 'spec', 'output_document'), true)
##     FileUtils.mv(@extracted_document_path, File.join(RAILS_ROOT, 'spec', 'output_document'))
##     File.open(File.join(RAILS_ROOT, 'spec', 'output_document', 'page001.xhtml'), 'w') do |file|
##       file << @page_html
##     end
#    correct_width = page.search("#ub_board")[0]['style'] =~ /width: 1124px/
#    correct_height = page.search("#ub_board")[0]['style'] =~ /height: 868px/
#    correct_width.should > 0
#    correct_height.should > 0
#  end
#
#  it "Page conversion should generate page.xhtml with corresponding background" do
#
#      page = Hpricot(@page_html)
#      nb_background = 0
#      background_elem = page.search("img") do |elem|
#        if (elem['ub:background'] == "true")
#          nb_background += 1
#          elem['src'].should == "objects/{327ff34c-874b-4d30-adfc-b3b772bcbd72}00001.png"
#        end
#      end
#      nb_background.should == 1
#  end
#
#  it "Page conversion should generate page.xhtml with corresponding images" do
#
#      page = Hpricot(@page_html)
#      images_elem = page.search("img")
#      images_elem.should have(3).items
#  end
#
#  it "Page conversion should generate page.xhtml with corresponding text" do
#      page = Hpricot(@page_html)
#      images_elem = page.search("div")
#      images_elem.should have(5).items
#  end
#
#  it "Page conversion should generate page.xhtml with corresponding widgets" do
#
#      page = Hpricot(@page_html)
#      nb_widget = 0
#      objects_elem = page.search("object") do |elem|
#        if (elem['type'] == "text/html")
#          nb_widget += 1
#          elem['data'].should == "widgets/{bbc2a299-fce1-4221-b9ee-540e8adf426d}.wdgt/ubGraph01.html"
#        end
#      end
#      nb_widget.should == 1
#  end
#
#  it "Page conversion should generate page.xhtml with corresponding drawing objects" do
#
#      page = Hpricot(@page_html)
#      svg_elem = page.search("svg:polygon")
#      svg_elem.should have(666).items
#
#  end
#
#  it "Page conversion should generate page.xhtml with correct object position and size" do
#
#      page = Hpricot(@page_html)
#      if (page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1").length > 0)
#        correct_width = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /width:97.0px/
#        correct_height = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /116.0px/
#        correct_top = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /54.239px/
#        correct_left = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /592.5703px/
#        correct_width.should > 0
#        correct_height.should > 0
#        correct_top.should > 0
#        correct_left.should > 0
#      end
#        false
#  end
#end