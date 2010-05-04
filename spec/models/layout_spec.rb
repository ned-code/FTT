require 'spec_helper'

describe Layout do

  should_allow_mass_assignment_of :uuid, :name, :thumbnail_url
  should_not_allow_mass_assignment_of :id, :theme_id, :model_page_id, :created_at, :updated_at

  should_belong_to :theme
  should_belong_to :model_page, :dependent => :delete
  should_have_many :pages


  describe "create_model_page! with the layout.html example" do
    before(:all) do
      @layout = Factory(:layout)
      @youtube_media = Factory(:widget, :system_name => 'youtube')
      @vimeo_media = Factory(:widget, :system_name => 'vimeo')
      @widget_media = Factory(:widget, :uuid => 'f8f78724-5922-4cd3-a99a-f87b601c8419')
      @creation_result = @layout.create_model_page!
    end

    after(:all) do
      @layout.destroy
      @youtube_media.destroy
      @vimeo_media.destroy
      @widget_media.destroy
    end

    it "should create a model page" do
      @creation_result.should be_true
    end

    it "should create class and css for model page" do
      hash = HashWithIndifferentAccess.new
      hash[:class] = 'webdoc layout-1head1column theme-background-3'
      hash[:css] = HashWithIndifferentAccess.new
      hash[:css][:width] = '1200px'
      hash[:css][:height] = '1600px'
      @layout.model_page.data.should == hash
    end

    it "should create text item" do
      @layout.model_page.items.count(:conditions => ['media_type = ?', 'text']).should == 1
    end

    it "should create html item" do
      @layout.model_page.items.count(:conditions => ['media_type = ? AND media_id IS ?', 'widget', nil]).should == 1
    end

    it "should create iframe item" do
      @layout.model_page.items.count(:conditions => ['media_type = ?', 'iframe']).should == 1
    end

    it "should create object image item" do
      @layout.model_page.items.count(:conditions => ['media_type = ?', 'image']).should == 1
    end

    it "should create object youtube item" do
      @youtube_media.should be_present
      @layout.model_page.items.count(:conditions => ['media_type = ? AND media_id = ?', 'widget', @youtube_media.id]).should == 1
    end

    it "should create object vimeo item" do
      @vimeo_media.should be_present
      @layout.model_page.items.count(:conditions => ['media_type = ? AND media_id = ?', 'widget', @vimeo_media.id]).should == 1
    end

    it "should create object application item" do
      @widget_media.should be_present
      @widget_media.uuid.should == "f8f78724-5922-4cd3-a99a-f87b601c8419"
      @layout.model_page.items.count(:conditions => ['media_type = ? AND media_id = ?', 'widget', @widget_media.id]).should == 1
    end

    it "should object can have param" do
      @vimeo_item = @layout.model_page.items.first(:conditions => ['media_type = ? AND media_id = ?', 'widget', @vimeo_media.id])

    end

    it "should create svg item" do
      @layout.model_page.items.count(:conditions => ['media_type = ?', 'drawing']).should == 1
    end

  end

end
