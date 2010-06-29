require 'spec_helper'

describe Theme do
  
  should_allow_mass_assignment_of :uuid, :file, :title, :thumbnail_url, :style_url, :version
  should_not_allow_mass_assignment_of :id, :created_at, :updated_at

  should_validate_presence_of :file
  should_validate_presence_of :title
  should_validate_presence_of :thumbnail_url
  should_validate_presence_of :style_url

  should_have_many :documents
  should_have_many :layouts, :dependent => :delete_all

  describe "set_attributes_from_config_file_and_save" do
    
    before(:all) do
      @theme = Theme.new(:file => File.open(Rails.root.join('spec','fixtures','theme_1_v0_1.zip')))
      @set_attr_result = @theme.set_attributes_from_config_file_and_save
    end

    after(:all) do
      @theme.destroy
    end

    it "should can set attributes form config file and save without ancestor" do
      @set_attr_result.should be_true
    end

    it "should have title" do
      @theme.version.should be_present
    end

    it "should have author" do
      @theme.author.should be_present
    end

    it "should have version" do
      @theme.version.should be_present
    end

    it "should have style_url" do
      @theme.version.should be_present
    end

    it "should have thumbnail_url" do
      @theme.version.should be_present
    end

    it "should have elements_url" do
      @theme.elements_url.should be_present
    end

    # TODO refactor for paperclip
    # if CarrierWave.yml_storage(:assets).to_s == "right_s3" || CarrierWave.yml_storage(:assets).to_s == "s3"
    #   it "should return the right url of the s3 to file.url" do
    #     @theme.file.url.include?("http://"+CarrierWave.yml_s3_bucket(:assets)).should be_true
    #   end
    # end


  end

end

# == Schema Information
#
# Table name: themes
#
#  uuid             :string(255)     primary key
#  title            :string(255)
#  thumbnail_url    :string(255)
#  style_url        :string(255)
#  file             :string(255)
#  version          :string(255)
#  updated_theme_id :integer(4)
#  author           :string(255)
#  elements_url     :string(255)
#  is_default       :boolean(1)      default(FALSE)
#

