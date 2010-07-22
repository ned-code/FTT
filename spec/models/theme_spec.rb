require 'spec_helper'

describe Theme do

  describe "set_attributes_from_config_file_and_save" do
    
    before(:all) do
      @theme = Factory(:theme)
    end

    after(:all) do
      @theme.destroy if @theme
    end

    it "should can set attributes form config file and save without ancestor" do
      @theme.title.should be_present
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

  end

end


# == Schema Information
#
# Table name: themes
#
#  uuid                    :string(255)     default(""), not null, primary key
#  title                   :string(255)
#  thumbnail_url           :string(255)
#  style_url               :string(255)
#  attachment_file_name    :string(255)
#  version                 :string(255)
#  updated_theme_id        :string(36)
#  author                  :string(255)
#  elements_url            :string(255)
#  is_default              :boolean(1)      default(FALSE)
#  attachment_content_type :string(255)
#  attachment_file_size    :integer(4)
#  attachment_updated_at   :datetime
#

