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
      document.size = { :width => "100", :height => "200" }
      document.save
      page = document.pages.create
      page.data.should == { :css => { :width => document.size[:width]+"px", :height => document.size[:height]+"px" } }
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
#

