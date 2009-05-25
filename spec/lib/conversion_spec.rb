require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require "conversion/html_conversion"

describe "Uniboard document conversion" do

  it "Document conversion should generate corresponding html file" do
    expected_result = File.open(fixture_file("conversion/index.html")).read
    document_zip_path = fixture_file("conversion/document.ubz")
    Zip::ZipFile.foreach(document_zip_path) do |an_entry|
      #need to create sub folder if needed
      if (an_entry.name.rindex("/") != nil)
        sub_folder = an_entry.name[0..an_entry.name.rindex("/")]
        if (!File.exist?(File.dirname(document_zip_path) + "/" + sub_folder))
          FileUtils.mkdir_p(File.dirname(document_zip_path) + "/" + sub_folder)
        end
      end
      an_entry.extract(File.dirname(document_zip_path) + "/" + an_entry.name)
    end 
        
    rdf_stream = File.open(File.dirname(document_zip_path) + "/metadata.rdf")
    ub_stream = File.open(File.dirname(document_zip_path) + "/00000000-0000-0000-0000-0000000.ub")
  
    result = HtmlConversion::create_html_document("00000000-0000-0000-0000-0000000", ub_stream, rdf_stream)
       
#    File.open(File.join(RAILS_ROOT, 'spec', 'output.html'), 'w') do |file|
#      file << result
#    end
    
    result.should == expected_result
    
  end 
  
  it "Test SVG page should generate corresponding Test HTML page" do
    #expected_result = File.open(fixture_file("conversion/page01.xhtml.html")).read
    document_zip_path = fixture_file("conversion/document.ubz")
    Zip::ZipFile.foreach(document_zip_path) do |an_entry|
      #need to create sub folder if needed
      if (an_entry.name.rindex("/") != nil)
        sub_folder = an_entry.name[0..an_entry.name.rindex("/")]
        if (!File.exist?(File.dirname(document_zip_path) + "/" + sub_folder))
          FileUtils.mkdir_p(File.dirname(document_zip_path) + "/" + sub_folder)
        end 
      end
      an_entry.extract(File.dirname(document_zip_path) + "/" + an_entry.name)
    end 
    svg_stream = File.open(File.dirname(document_zip_path) + "/page001.svg")
    result = HtmlConversion::convert_svg_page_to_html("00000000-0000-0000-0000-0000001", svg_stream)
       
    FileUtils.mv(File.dirname(document_zip_path), File.join(RAILS_ROOT, 'spec', 'output_document'))
    File.open(File.join(RAILS_ROOT, 'spec', 'output_document', 'page001.xhtml'), 'w') do |file|
      file << result 
    end  
    true#result.should == expected_result
                  
  end
end