require 'spec_helper'

describe Medias::Widget do
  
  it "should be valid" do
    widget = Medias::Widget.new
    widget.should be_valid
  end
  
  it "should not be valid with image file" do
    widget = Medias::Widget.new(:file => File.open(fixture_path + '/image.jpg'))
    widget.should_not be_valid
  end
  
  it "should be valid with zip file" do
    widget = Medias::Widget.new(:file => File.open(fixture_path + '/widget.zip'))
    widget.should be_valid
  end
  
  describe 'with valid widget file' do
     before(:all) do
       @widget = Medias::Widget.new(:file => File.open(fixture_path + '/widget.zip'), :system_name => 'widget')
       @widget.save # Will trigger before_save and after_save, in which actions are done
     end

     it "should have a properties hash as attribute" do
       @widget.properties.should be_kind_of(Hash)
     end
     
     it "should have a version present in the properties" do
       @widget.properties[:version].should be_kind_of(String)
     end
     
     it "should have a title" do
       @widget.title.should_not == nil
     end
     
     it "should have a title as a string" do
       @widget.title.should be_kind_of(String)
     end
     
     it "should have a description" do
       @widget.description.should_not == nil
     end
     
     it "should have a description as a string" do
       @widget.description.should be_kind_of(String)
     end
     
     it "should have the width set in the properties" do
       @widget.properties[:width].should_not == nil
     end
     
     it "should have the height set in the properties" do
       @widget.properties[:height].should_not == nil
     end
     
     it "should have the index_url set in the properties" do
       @widget.properties[:index_url].should_not == nil
     end
     
     it "should have the icon_url set in the properties" do
       @widget.properties[:icon_url].should_not == nil
     end
     
     it "should have the inspector_url set in the properties" do
       @widget.properties[:inspector_url].should_not == nil
     end
     
     it "should have an uuid set" do
       @widget.uuid.should_not == nil
     end
     
     it "should have a system name set" do
       @widget.system_name.should_not == nil
     end
     
   end
   
  describe 'with valid widget and update file' do
    before(:all) do
      @widget = Medias::Widget.new(:file => File.open(fixture_path + '/widget.zip'), :system_name => 'poll')
      @widget.save
      
      @widget.update_with_file(File.open(fixture_path + '/widget_updated.zip'))
      #@widget.save # Will trigger before_save and after_save, in which actions are done
    end
   
    it "should have have a new version number" do
      @widget.version.should == "0.5"
    end
    
    it "should have have a new title" do
      @widget.title.should == "Poll - new version"
    end
    
    it "should have have a new description" do
      @widget.description.should == "Widget de polling updated"
    end
   
  end
end

# == Schema Information
#
# Table name: medias
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(65537)
#  user_id     :integer
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

