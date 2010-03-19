require 'spec_helper'

describe Page do
  
  should_allow_mass_assignment_of :uuid, :position, :version, :data, :title, :items_attributes
  should_not_allow_mass_assignment_of :id, :thumbnail_id, :document_id, :created_at, :updated_at
  
  should_be_built_by_factory
  should_be_created_by_factory
  
  should_have_many :items, :dependent => :delete_all
  should_belong_to :document
  should_belong_to :thumbnail, :class_name => "Medias::Thumbnail"
  
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
  
  describe "new" do
    subject { Factory.create(:page) }
    
    it "should have default css data" do
      subject.data.should == { :css => { :width => "800px", :height => "600px", :backgroundColor => "#fff" } }
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
      page.data.should == { :css => { :width => document.size[:width]+"px", :height => document.size[:height]+"px", :backgroundColor => "#fff" } }
    end
  end
  
end

# == Schema Information
#
# Table name: pages
#
#  id           :integer         not null, primary key
#  uuid         :string(36)
#  document_id  :integer         not null
#  thumbnail_id :integer
#  position     :integer         not null
#  version      :integer         default(1), not null
#  data         :text(65537)
#  created_at   :datetime
#  updated_at   :datetime
#  title        :string(255)     default("undefined")
#

