require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardPage do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  before(:each) do
    @user = Factory.create(:user)
    @page = Factory.create(:uniboard_page)
    @page.document.accepts_role 'owner', @user
  end

  context 'with s3 storage' do

    it 'should have url' do
      @page.url.should =~ URI_FORMAT_REGEX
    end

  end

  context 'newly created' do

    it 'should have its version to 1' do
      page = Factory.build(:uniboard_page)

      page.should be_valid
      page.should have(:no).errors
      page.save.should be_true
      page.version.should == 1
    end

  end
end
