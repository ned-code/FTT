TEST_S3_CONNECTION = true unless Object.const_defined?('TEST_S3_CONNECTION')
require File.expand_path(File.dirname(__FILE__) + '/spec_helper')

NB_TEST_S3_CONNECTION = ENV['NB_TEST_S3_CONNECTION'] ? ENV['NB_TEST_S3_CONNECTION'].to_i : 10

describe 'Documents' do

  1.upto(NB_TEST_S3_CONNECTION) do |i|
    it "should be saved (#{i})" do
      document = Factory.build(:uniboard_document)

      document.save.should be_true
    end
  end

end
