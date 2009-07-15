# To change this template, choose Tools | Templates
# and open the template in the editor.
require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require "conversion/ub_document_converter"
require "conversion/ub_page_converter"
require "conversion/pdf_converter"

describe ConversionService::UbPageConverter do

  before(:all) do
    @converted_file_path = File.join(RAILS_ROOT, 'tmp', 'conversions')
    FileUtils.mkdir_p(@converted_file_path)
    @storage = Storage.storage(:name => :filesystem)
  end

  context "document conversion" do
    before(:each) do
      @ub_file = fixture_file('conversion/00000000-0000-0000-0000-0000000.ub')
      @rdf_file = fixture_file('conversion/metadata.rdf')
    end

    it "should convert ub document to HTML index file" do
      options = {}
      options[:document_uuid] = "00000000-0000-0000-0000-0000000"
      options[:document_rdf_stream] = File.open(@rdf_file,'rb')
      options[:destination_path] = File.join(@converted_file_path)
      page_file_name = ConversionService::convert_file(@ub_file, UbMedia::UB_DOCUMENT_TYPE, "application/xhtml+xml", options)
      @converted_file = File.join(options[:destination_path], page_file_name)
      index_html = File.open(@converted_file,'rb').read()
      expected_result = File.open(fixture_file(File.join('conversion', 'index.html')),'rb').read
      index_html.should == expected_result
      RAILS_DEFAULT_LOGGER.debug "index file #{@converted_file}"
      FileUtils.remove_file(@converted_file, true)
    end
  end

  context "page conversion" do

    before(:all) do
      pdf_file = fixture_file('conversion/327ff34c-874b-4d30-adfc-b3b772bcbd72.pdf')
      @storage.put('0ade677d-8b59-44c7-9cdb-30be681d4667/objects/327ff34c-874b-4d30-adfc-b3b772bcbd72.pdf', File.open(pdf_file,'rb'))
      @pdf_media = UbMedia.new()
      @pdf_media.uuid = '327ff34c-874b-4d30-adfc-b3b772bcbd72'
      @pdf_media.media_type = 'application/pdf'
      @pdf_media.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/objects/327ff34c-874b-4d30-adfc-b3b772bcbd72.pdf'
      @pdf_media.storage_config = @storage.to_s
      @pdf_media.save

      @page_file = fixture_file('conversion/page001.svg')
      @page_media = UbMedia.new()
      @storage.put('0ade677d-8b59-44c7-9cdb-30be681d4667/page001.svg', File.open(@page_file,'rb'))
      @page_media.uuid = '0ade677d-8b59-44c7-9cdb-30be681d4667'
      @page_media.media_type = UbMedia::UB_PAGE_TYPE
      @page_media.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/page001.svg'
      @page_media.storage_config = @storage.to_s
      @page_media.save

      @image_1 = UbMedia.new()
      @image_1.uuid = '5e99b60d-385e-477a-9050-c5f2338d8ce1'
      @image_1.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/images/5e99b60d-385e-477a-9050-c5f2338d8ce1.png'
      @image_1.storage_config = @storage.to_s
      @image_1.save!

      @image_2 = UbMedia.new()
      @image_2.uuid = '0d7fa9b6-d611-4318-85af-5493fe2e65d4'
      @image_2.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/images/0d7fa9b6-d611-4318-85af-5493fe2e65d4.svg'
      @image_2.storage_config = @storage.to_s
      @image_2.save!

      @image_3 = UbMedia.new()
      @image_3.uuid = 'fc287439-7f6d-404a-82ca-19b14f20a56c'
      @image_3.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/images/fc287439-7f6d-404a-82ca-19b14f20a56c.svg'
      @image_3.storage_config = @storage.to_s
      @image_3.save!

      @widget_1 = UbMedia.new()
      @widget_1.uuid = 'bbc2a299-fce1-4221-b9ee-540e8adf426d'
      @widget_1.path = '0ade677d-8b59-44c7-9cdb-30be681d4667/widgets/bbc2a299-fce1-4221-b9ee-540e8adf426d.wdgt/ubGraph01.html'
      @widget_1.storage_config = @storage.to_s
      @widget_1.save!

      options = {}
      options[:page_uuid] = "0ade677d-8b59-44c7-9cdb-30be681d4667"
      options[:destination_path] = File.join(@converted_file_path)
      page_file_name = ConversionService::convert_media(@page_media, "application/xhtml+xml", options)
      @converted_file = File.join(options[:destination_path], page_file_name)
      @page_html = File.open(@converted_file,'rb').read()
    end

    after(:all) do
      @pdf_media.delete
      @page_media.delete
      @image_1.delete
      @image_2.delete
      @image_3.delete
      @widget_1.delete
      RAILS_DEFAULT_LOGGER.debug "page file #{@converted_file}"
      FileUtils.remove_file(@converted_file, true)
    end

  it "Page conversion should generate page.xhtml with correct document size" do

     page = Hpricot(@page_html)
     # uncomment to generate output on disk under spec/output_docuement
#     FileUtils.remove_dir(File.join(RAILS_ROOT, 'spec', 'output_document'), true)
#     FileUtils.mv(@extracted_document_path, File.join(RAILS_ROOT, 'spec', 'output_document'))
#     File.open(File.join(RAILS_ROOT, 'spec', 'output_document', 'page001.xhtml'), 'wb') do |file|
#       file << @page_html
#     end
    correct_width = page.search("#ub_board")[0]['style'] =~ /width: 1124px/
    correct_height = page.search("#ub_board")[0]['style'] =~ /height: 868px/
    correct_width.should > 0
    correct_height.should > 0
  end

  it "Page conversion should generate page.xhtml with corresponding background" do

      page = Hpricot(@page_html)
      nb_background = 0
      background_elem = page.search("img") do |elem|
        if (elem['ub:background'] == "true")
          nb_background += 1
          elem['src'].should match(/objects\/327ff34c-874b-4d30-adfc-b3b772bcbd7200001.png/)
        end
      end
      nb_background.should == 1
  end

  it "Page conversion should generate page.xhtml with corresponding images" do

      page = Hpricot(@page_html)
      images_elem = page.search("img")
      images_elem.should have(3).items
  end

  it "Page conversion should generate page.xhtml with corresponding text" do
      page = Hpricot(@page_html)
      images_elem = page.search("div")
      images_elem.should have(6).items
  end

  it "Page conversion should generate page.xhtml with corresponding widgets" do

      page = Hpricot(@page_html)
      nb_widget = 0
      objects_elem = page.search("object") do |elem|
        if (elem['type'] == "text/html")
          nb_widget += 1
          elem['data'].should match(/bbc2a299-fce1-4221-b9ee-540e8adf426d.wdgt\/ubGraph01.html/)
        end
      end
      nb_widget.should == 1
  end

  it "Page conversion should generate page.xhtml with corresponding drawing objects" do

      page = Hpricot(@page_html)
      svg_elem = page.search("#ub_page_drawing").search("object").first
      svg_elem['data'].should match(/0ade677d-8b59-44c7-9cdb-30be681d4667\/0ade677d-8b59-44c7-9cdb-30be681d4667.drawing.svg/)

  end

  it "Page conversion should generate page.xhtml with correct object position and size" do

      page = Hpricot(@page_html)
      if (page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1").length > 0)
        correct_width = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /width:97.0px/
        correct_height = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /116.0px/
        correct_top = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /54.239px/
        correct_left = page.search("#5e99b60d-385e-477a-9050-c5f2338d8ce1")[0]['style'] =~ /592.5703px/
        correct_width.should > 0
        correct_height.should > 0
        correct_top.should > 0
        correct_left.should > 0
      end
        false
  end
  end
end

