TEST_S3_CONNECTION = true unless Object.const_defined?('TEST_S3_CONNECTION')
require File.expand_path(File.dirname(__FILE__) + '/spec_helper')

NB_TEST_S3_CONNECTION = ENV['NB_TEST_S3_CONNECTION'] ? ENV['NB_TEST_S3_CONNECTION'].to_i : 1

describe 'Documents' do

  1.upto(NB_TEST_S3_CONNECTION) do |i|
    it "should be saved (#{i})" do
      document = Factory.build(:uniboard_document)

      document.save.should be_true
    end
  end

  it 'should have url' do
    document = Factory.create(:uniboard_document)

    document.pages.first.url.should =~ URL_FORMAT_REGEX
  end

  it 'should have thumbnail url' do
    document = Factory.create(:uniboard_document)

    document.pages.first.thumbnail_url.should =~ URL_FORMAT_REGEX
  end

  it 'should have mime type' do
    document = Factory.create(:uniboard_document)

    document.pages.first.mime_type.should == 'image/svg+xml'
  end

  it 'should have thumbnail mime type' do
    document = Factory.create(:uniboard_document)

    document.pages.first.thumbnail_mime_type.should == 'image/jpeg'
  end

end
