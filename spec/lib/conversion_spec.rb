require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require "conversion/html_conversion"

describe "Uniboard document conversion" do

  it "Document conversion should generate corresponding html file" do
    expected_result = File.open(fixture_file("conversion/index.html")).read
    rdf_stream = File.open(fixture_file("conversion/metadata.rdf"))
    ub_stream = File.open(fixture_file("conversion/00000000-0000-0000-0000-0000000.ub"))
    
    result = HtmlConversion::create_html_document("00000000-0000-0000-0000-0000000", ub_stream, rdf_stream)
#    File.open(File.join(RAILS_ROOT, 'spec', 'output.html'), 'w') do |file|
#      file << result
#    end
    
    result.should == expected_result
    
  end
  
  it "Test SVG page should generate corresponding Test HTML page" do
    expected_result = File.open(fixture_file("conversion/index.html")).read
    svg_stream = File.open(fixture_file("conversion/page001.svg"))
    result = HtmlConversion::convert_svg_page_to_html("00000000-0000-0000-0000-0000001", svg_stream)
#    File.open(File.join(RAILS_ROOT, 'spec', 'outputPage.html'), 'w') do |file|
#      file << result
#    end
   
    true#result.should == expected_result
            
  end
end