require 'spec_helper'

describe Medias::Image do
  
  it "should be valid" do
    image = Factory(:image)
    image.should be_valid
  end
  
  it "should not be valid with a zip file" do
    image = Factory.build(:image, :attachment => File.open(fixture_path + '/widget.zip'))
    image.should_not be_valid
  end
  
  describe 'with valid image file' do
     subject { Factory(:image) }
     
     its(:uuid)                           { should be_present }
     its(:attachment_content_type)        { should be_present }
     its(:attachment_content_type)        { should be_kind_of(String) }
     its(:attachment_file_name)           { should be_present }
     its(:attachment_file_name)           { should be_kind_of(String) }
     its(:attachment_file_size)           { should be_present }
     its(:attachment_file_size)           { should be_kind_of(Integer) }
     its(:properties)                     { should be_kind_of(Hash) }

     it { subject.properties[:default_url].should be_present }
     it { subject.properties[:thumb_url].should be_present }
     it { subject.properties[:url].should be_present }
     
   end
   
   describe 'download_image_provided_by_remote_attachment_url from internet' do
     image = Factory(:image, :attachment => nil, :remote_attachment_url => 'http://www.google.ch/images/chrome_48.gif')
     image.attachment.should_not == nil
   end
   
   describe 'download image with extension broken from internet' do
     #if the test is broken, verify that the image is still available on internet
    image = Factory(:image, :attachment => nil, :remote_attachment_url => 'http://dragonartz.files.wordpress.com/2009/05/vector-kids-background-preview-by-dragonart.png%3Fw%3D495%26h%3D495')
    image.attachment_file_name == 'vector-kids-background-preview-by-dragonart.png'
  end
    
  describe 'properties should not be nil' do
    image = Factory(:image, :properties => nil)
    image.properties.should_not == nil
  end
end