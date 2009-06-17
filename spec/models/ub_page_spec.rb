require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbPage do
  it('') { should be_built_by_factory }
  it('') { should be_created_by_factory }

  shared_examples_for 'page with filesystem storage' do

    before(:each) do
      UbDocument.config[:storage] = :filesystem
    end

  end

  shared_examples_for 'page with s3 storage' do

    before(:each) do
      UbDocument.config[:storage] = :s3
    end

  end

  context 'recently created' do

    shared_examples_for 'page recently created' do

      it 'should have its version to 1' do
        page = Factory.build(:ub_page)

        page.should be_valid
        page.should have(:no).errors
        page.save.should be_true
        page.version.should == 1
      end

    end

    context 'with filesystem storage' do
      it_should_behave_like 'page with filesystem storage'
      it_should_behave_like 'page recently created'

    end

    context 'with s3 storage' do
      it_should_behave_like 'page with s3 storage'
      it_should_behave_like 'page recently created'

    end

  end

  context 'existing' do

    before(:each) do
      @user = Factory.create(:user)
      @document = Factory.create(:ub_document)
      @document.accepts_role 'owner', @user
      @page = @document.pages.first
    end

    shared_examples_for 'page existing' do

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
    end

    context 'with filesystem storage' do
      it_should_behave_like 'page with filesystem storage'
      it_should_behave_like 'page existing'

      it 'should have file url' do
        @page.url.should =~ FILE_URL_FORMAT_REGEX
      end

      it 'should have thumnail file url' do
        @page.thumbnail_url.should =~ FILE_URL_FORMAT_REGEX
      end
    end

    context 'with s3 storage' do
      it_should_behave_like 'page with s3 storage'
      it_should_behave_like 'page existing'

      it 'should have http url' do
        @page.url.should =~ HTTP_URL_FORMAT_REGEX
        @page.url.should =~ /[\?&]signature=/i
      end

      it 'should have thumnail http url' do
        @page.thumbnail_url.should =~ HTTP_URL_FORMAT_REGEX
        @page.thumbnail_url.should_not =~ /[\?&]signature=/i
      end
    end
  end

  context 'collection' do

    before(:each) do
      @user = Factory.create(:user)

      @document = Factory.create(:ub_document)
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
