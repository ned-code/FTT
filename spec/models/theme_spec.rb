require 'spec_helper'

describe Theme do

  should_allow_mass_assignment_of :uuid, :file, :name, :thumbnail_url, :style_url, :version
  should_not_allow_mass_assignment_of :id, :created_at, :updated_at

  should_validate_presence_of :file
  should_validate_presence_of :name
  should_validate_presence_of :thumbnail_url
  should_validate_presence_of :style_url

  should_have_many :documents
  should_have_many :layouts, :dependent => :delete_all  

  describe "set_attributes_from_config_file_and_save" do
    
    subject { Theme.new(:file => File.open(Rails.root.join('spec','fixtures','theme_1_v0_1.zip'))) }

    it "should can set attributes form config file and save without ancestor" do
      subject.set_attributes_from_config_file_and_save.should be_true  
    end

  end

end
