require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')
require File.expand_path(File.dirname(__FILE__) + '/../storage_spec')
require 'storage/s3'

VALID_S3_CONFIG = {
  'access_key_id' => '12345',
  'secret_access_key' => 'ABCVDEF'
}

describe Storage::S3 do

  before(:each) do
    @storage = Storage.storage(:name => :s3)
  end

  it 'should is a Storage::Filesystem' do
    storage = Storage.storage(:name => :s3)

    storage.should be_a(Storage::S3)
  end

  it 'should not need config in options' do
    lambda { Storage.storage(:name => :s3) }.should_not raise_error(ArgumentError)
  end

  it 'should accept valid config in options' do
    lambda { Storage.storage(:name => :s3, :connection_config => VALID_S3_CONFIG) }.should_not raise_error(ArgumentError)
  end

  it 'should not accept empty config in options' do
    lambda { Storage.storage(:name => :s3, :connection_config => {}) }.should raise_error(ArgumentError)
  end

  context "connection" do

    it 'should not raise error with valid configuration Hash' do
      s3_config = VALID_S3_CONFIG.dup

      lambda { Storage::S3.connection(s3_config) }.should_not raise_error(ArgumentError)
    end

    it 'should not raise error without configuration Hash' do
      lambda { Storage::S3.connection }.should_not raise_error(ArgumentError)
    end

    it 'should return same connection with same config' do
      s3_config = VALID_S3_CONFIG.dup

      Storage::S3.connection(s3_config).should === Storage::S3.connection(s3_config)
    end

    it 'should return different connection with different config' do
      s3_config = VALID_S3_CONFIG.dup

      Storage::S3.connection(s3_config.merge(:options => {:test => true})).should_not === Storage::S3.connection(s3_config.merge(:options => {:test => false}))
    end

    it "should raise error with configuration Hash without 'access_key_id'" do
      s3_config = VALID_S3_CONFIG.dup
      s3_config.delete('access_key_id')

      lambda { Storage::S3.connection(s3_config) }.should raise_error(ArgumentError, /access_key_id/)
    end

    it "should raise error with configuration Hash without 'secret_access_key'" do
      s3_config = VALID_S3_CONFIG.dup
      s3_config.delete('secret_access_key')

      lambda { Storage::S3.connection(s3_config) }.should raise_error(ArgumentError, /secret_access_key/)
    end

  end

  context "'put' method" do
    it_should_behave_like 'storage interface for put method'

    it "should be implemented" do
      lambda { @storage.put(*STORAGE_PUT_PARAMS) }.should_not raise_error(NotImplementedError)
    end

  end

end