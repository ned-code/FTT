require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'storage/s3'

describe 'Uniboard Document storage with S3' do

  before(:each) do
    @valid_s3_config = {
      'access_key_id' => '12345',
      'secret_access_key' => 'ABCVDEF',
      'bucket' => 'uniboard-test'
    }
  end

  it 'Configuration should not raise error with valid configuration Hash' do
    s3_config = @valid_s3_config.dup

    lambda { Storage::S3::Configuration.new(s3_config) }.should_not raise_error
  end

  it "Configuration should raise error with configuration Hash without 'access_key_id'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('access_key_id')

    lambda { Storage::S3::Configuration.new(s3_config) }.should raise_error(ArgumentError, /access_key_id/)
  end

  it "Configuration should raise error with configuration Hash without 'secret_access_key'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('secret_access_key')

    lambda { Storage::S3::Configuration.new(s3_config) }.should raise_error(ArgumentError, /secret_access_key/)
  end

  it "Configuration should raise error with configuration Hash without 'bucket'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('bucket')

    lambda { Storage::S3::Configuration.new(s3_config) }.should raise_error(ArgumentError, /bucket/)
  end

  it 'Configuration should have bucket_name attribute' do
    Storage::S3::Configuration.config.should respond_to(:bucket_name)
  end

  it 'Configuration should have access_key_id attribute' do
    Storage::S3::Configuration.config.should respond_to(:access_key_id)
  end

  it 'Configuration should have secret_access_key attribute' do
    Storage::S3::Configuration.config.should respond_to(:secret_access_key)
  end

  it 'Configuration should have bucket attribute' do
    Storage::S3::Configuration.config.should respond_to(:bucket)
  end

end