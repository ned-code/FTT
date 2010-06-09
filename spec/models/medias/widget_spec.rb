require 'spec_helper'

describe Medias::Widget do
  
  before(:each) do
    @s3 = mock("s3")
    RightAws::S3Interface.stub(:new).and_return(@s3)
    @s3.stub(:put) # stub here to be able to use should_receive
  end
  
  it "should be valid" do
    widget = Medias::Widget.new
    widget.should be_valid
  end
  
  it "should not be valid with image file" do
    widget = Factory.build(:widget, :file => File.open(fixture_path + '/image.jpg'))
    widget.should_not be_valid
  end
  
  it "should be valid with zip file" do
    widget = Factory.build(:widget)
    widget.should be_valid
  end
  
  describe 'with valid widget file' do
     subject { Factory(:widget) }
     
     its(:uuid)        { should be_present }
     its(:system_name) { should be_present }
     its(:title)       { should be_present }
     its(:title)       { should be_kind_of(String) }
     its(:description) { should be_present }
     its(:description) { should be_kind_of(String) }
     its(:properties)  { should be_kind_of(Hash) }
     
     it { subject.properties[:version].should be_kind_of(String) }
     it { subject.properties[:width].should be_present }
     it { subject.properties[:height].should be_present }
     it { subject.properties[:index_url].should be_present }
     it { subject.properties[:icon_url].should be_present }
     it { subject.properties[:inspector_url].should be_present }
     
   end
   
  describe 'with valid widget and update file' do
    subject do
      Factory(:widget, :system_name => 'poll')
      media = Medias::Widget.last
      media.update_attributes(:file => File.open(fixture_path + '/widget_updated.zip'))
      media
    end
    
    its(:version)     { should == "0.5" }
    its(:title)       { should == "Poll - new version" }
    its(:description) { should == "Widget de polling updated" }
    
  end
  
  describe 'with valid base and update WGT files' do
    subject do
      Factory(:widget, :file => File.open(fixture_path + '/Youtube.wgt'), :system_name => 'youtube')
      media = Medias::Widget.last
      media.update_attributes(:file => File.open(fixture_path + '/Youtube_new.wgt'))
      media
    end

    its(:version)     { should == "1.32" }
    its(:title)       { should == "Youtube player" }
    its(:description) { should == "Watch and edit Youtube's videos." }

  end
end



# == Schema Information
#
# Table name: medias
#
#  uuid        :string(36)      primary key
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(16777215)
#  user_id     :string(36)
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

