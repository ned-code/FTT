require 'spec_helper'

describe Page do

  before do
    Factory(:theme_without_upload)
  end
      
  describe "position" do
    
    it "should be 0 when created from new document" do
      document = Factory(:document)
      page = document.pages.first
      page.position.should == 0
    end
    
    it "should be 1 when created from a document with already a page" do
      document = Factory(:document)
      page = document.pages.create
      page.position.should == 1
    end
    
  end
  
  describe 'collection nagivation' do
    before(:each) do
      @document = Factory(:document)
      @page0 = @document.pages.first
      @page1 = @document.pages.create
    end
    it { @page0.previous.should be_nil }
    it { @page1.previous.should == @page0 }
    it { @page0.next.should == @page1 }
    it { @page1.next.should be_nil }  
  end
  
  describe "title" do
    it "should have 'undefined' as title" do
      document = Factory(:document)
      page = document.pages.create
      page.title.should == "undefined"
    end
  end
  
  describe "size" do
    it "should have width and height values used when creating a page" do
      document = Factory(:document)
      document.size = { 'width' => "100", 'height' => "200" }
      document.save
      page = document.pages.create
      page.data.should == { 'css' => { 'width' => document.size['width']+"px", 'height' => document.size['height']+"px" } }
    end
  end

  describe "thumbnail_frame_size method" do
    it "should return the same size if the aspec ratio is less 3" do
      document = Factory(:document, :size => { 'width' => "100", 'height' => "200" })
      document.pages.first.calc_thumbnail_frame_size.should == { 'width' => "100", 'height' => "200" }
    end

    it "should return the a smaller height if the aspec ratio is more 3 and the longer size is height" do
      document = Factory(:document, :size => { 'width' => "200", 'height' => "800" })
      document.pages.first.calc_thumbnail_frame_size.should == { 'width' => "200", 'height' => "600" }
    end

    it "should return the a smaller width if the aspec ratio is more 3 and the longer size is width" do
      document = Factory(:document, :size => { 'width' => "800", 'height' => "200" })
      document.pages.first.calc_thumbnail_frame_size.should == { 'width' => "600", 'height' => "200" }
    end
  end

  describe "self.calc_thumbnail_size" do
    it "should return the max size if the size is smaller" do
      result = Page.calc_thumbnail_size({ 'width' => "50", 'height' => "100" }, 200, 300)
      result.should == { 'width' => "150", 'height' => "300" }
    end

    it "should return the max size if the size is bigger" do
      result = Page.calc_thumbnail_size({ 'width' => "600", 'height' => "400" }, 300, 300)
      result.should == { 'width' => "300", 'height' => "200" }
    end
  end
  
end





# == Schema Information
#
# Table name: pages
#
#  uuid                   :string(36)      default(""), not null, primary key
#  document_id            :string(36)
#  thumbnail_id           :string(36)
#  position               :integer(4)      not null
#  version                :integer(4)      default(1), not null
#  data                   :text(16777215)
#  created_at             :datetime
#  updated_at             :datetime
#  title                  :string(255)     default("undefined")
#  layout_kind            :string(255)
#  thumbnail_file_name    :string(255)
#  thumbnail_need_update  :boolean(1)
#  thumbnail_secure_token :string(36)
#  thumbnail_request_at   :datetime
#  deleted_at             :datetime
#

