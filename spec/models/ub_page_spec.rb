require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbPage do
  it('') { should be_built_by_factory }
  it('') { should be_created_by_factory }

  before(:all) do
    UbPage.send(:public, :parse_svg_page)
  end
  after(:all) do
    UbPage.send(:protected, :parse_svg_page)
  end
  
  context 'recently created' do

    it 'should have its version to 1' do
      page = Factory.build(:ub_page_with_doc)

      page.should be_valid
      page.should have(:no).errors
      page.save.should be_true
      page.version.should == 1
    end

    it 'should create 3 page elements when parsing default svg_file' do

      ActiveRecord::Base.transaction do

        page = Factory.build(:ub_page_with_doc)

        image_media = Factory.build(:ub_media)
        image_media.uuid = UUID.new.generate
        image_media.save!

        svg_image_media = Factory.build(:ub_media)
        svg_image_media.uuid = UUID.new.generate
        svg_image_media.save!

        widget_media = Factory.build(:ub_media)
        widget_media.uuid = UUID.new.generate
        widget_media.save!

        svg_file = File.open(fixture_file(File.join('ub_page', 'default_svg_page.svg'))).read()
        svg_file.gsub!(/\{image_uuid\}/, image_media.uuid)
        svg_file.gsub!(/\{image_svg_uuid\}/, svg_image_media.uuid)
        svg_file.gsub!(/\{widget_uuid\}/, widget_media.uuid)
        page.parse_svg_page(svg_file)
        page.should have(3).page_element
      end
    end

  end

  context 'existing' do

    before(:each) do
      @user = Factory.create(:user)
      @page = Factory.create(:ub_page_with_doc)
      @document = @page.document
      @document.accepts_role 'owner', @user
    end

    it 'should have url' do
      @page.url.should =~ URL_FORMAT_REGEX
    end

    it 'should have thumbnail url' do

      @page.thumbnail_url.should =~ URL_FORMAT_REGEX
    end

    it 'should have mime type' do
      @page.mime_type.should == 'image/svg+xml'
    end

    it 'should have thumbnail mime type' do
      @page.thumbnail_mime_type.should == 'image/jpeg'
    end

    it 'should raise media missing exception when parsing svg file that refer missing media' do
      page = Factory.build(:ub_page_with_doc)

      image_media = Factory.build(:ub_media)
      image_media.uuid = UUID.new.generate

      widget_media = Factory.build(:ub_media)
      widget_media.uuid = UUID.new.generate

      page.page_elements.build(:media => image_media)
      page.page_elements.build(:media => widget_media)
      page.save!

      svg_file = File.open(fixture_file(File.join('ub_page', 'default_svg_page.svg'))).read()
      svg_file.gsub!(/\{image_uuid\}/, image_media.uuid)
      svg_file.gsub!(/\{widget_uuid\}/, widget_media.uuid)

      lambda {page.parse_svg_page(svg_file)}.should raise_error
    end

    it 'should delete 1 page elements when parsing default svg_file' do
      page = Factory.build(:ub_page_with_doc)

      image_media = Factory.build(:ub_media)
      image_media.path = "images/image1.png"
      image_media.uuid = UUID.new.generate

      svg_image_media = Factory.build(:ub_media)
      svg_image_media.path = "images/image2.png"
      svg_image_media.uuid = UUID.new.generate

      svg_image_media_to_delete = Factory.build(:ub_media)
      svg_image_media_to_delete.path = "images/image3.png"
      svg_image_media_to_delete.uuid = UUID.new.generate

      widget_media = Factory.build(:ub_media)
      widget_media.uuid = UUID.new.generate

      page.page_elements.build(:media => image_media)
      page.page_elements.build(:media => svg_image_media)
      page.page_elements.build(:media => widget_media)
      page.page_elements.build(:media => svg_image_media_to_delete)
      page.save!

      svg_file = File.open(fixture_file(File.join('ub_page', 'default_svg_page.svg'))).read()
      svg_file.gsub!(/\{image_uuid\}/, image_media.uuid)
      svg_file.gsub!(/\{image_svg_uuid\}/, svg_image_media.uuid)
      svg_file.gsub!(/\{widget_uuid\}/, widget_media.uuid)

      page.parse_svg_page(svg_file)
      lambda {page.save!}.should change(UbPageElement, :count).by(-1)
      page.reload
      page.should have(3).page_element
    end

    it 'should add 1 page elements when parsing default svg_file' do

      page = Factory.build(:ub_page_with_doc)

      image_media = Factory.build(:ub_media)
      image_media.uuid = UUID.new.generate

      widget_media = Factory.build(:ub_media)
      widget_media.uuid = UUID.new.generate

      page.page_elements.build(:media => image_media)
      page.page_elements.build(:media => widget_media)
      page.save!

      ActiveRecord::Base.transaction do
        svg_image_media = Factory.build(:ub_media)
        svg_image_media.uuid = UUID.new.generate
        svg_image_media.save!
        svg_file = File.open(fixture_file(File.join('ub_page', 'default_svg_page.svg'))).read()
        svg_file.gsub!(/\{image_uuid\}/, image_media.uuid)
        svg_file.gsub!(/\{image_svg_uuid\}/, svg_image_media.uuid)
        svg_file.gsub!(/\{widget_uuid\}/, widget_media.uuid)

        page.parse_svg_page(svg_file)
        lambda {page.save!}.should change(UbPageElement, :count).by(1)
        page.reload
        page.should have(3).page_element
      end
    end

  end

  context 'collection' do

    before(:each) do
      @user = Factory.create(:user)

      @page = Factory.create(:ub_page_with_doc)
      @document = @page.document
      @document.accepts_role 'owner', @user

      @not_owned_document = Factory.create(:ub_document)
      @not_owned_document.accepts_role 'owner', Factory.create(:user)
    end

    it 'should return page after the first' do
      @document.pages[0].next.should == @document.pages[1]
    end

    it 'should return nil before the first' do
      @document.pages[0].previous.should be_nil
    end

    it 'should return page before the last' do
      @document.pages[-1].previous.should == @document.pages[-2]
    end

    it 'should return nil after the last' do
      @document.pages[-1].next.should be_nil
    end

  end
end
