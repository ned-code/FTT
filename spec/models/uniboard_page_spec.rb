require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardPage do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it "version number is initialized on create" do
    page = Factory.build(:uniboard_page)

    page.save.should be_true
    page.version.should == 1
  end
end
