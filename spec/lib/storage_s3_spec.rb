require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'storage/s3'

class TestStorage
end

describe 'Uniboard Document storage with S3' do

  before(:each) do
    @test_storage = TestStorage.new
    @test_storage.extend(Storage::S3::Base)

    @valid_s3_config = {
      'access_key_id' => '12345',
      'secret_access_key' => 'ABCVDEF',
      'bucket' => 'uniboard-test'
    }
  end

  it 'Configuration should not raise error with valid configuration Hash' do
    @test_storage.should_receive(:config).and_return({:s3 => @valid_s3_config})

    @test_storage.s3_config.should be_a_kind_of(Storage::S3::Configuration)
  end

  it "Configuration should raise error with configuration Hash without 'access_key_id'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('access_key_id')

    @test_storage.should_receive(:config).and_return({:s3 => s3_config})

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /access_key_id/)
  end

  it "Configuration should raise error with configuration Hash without 'secret_access_key'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('secret_access_key')

    @test_storage.should_receive(:config).and_return({:s3 => s3_config})

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /secret_access_key/)
  end

  it "Configuration should raise error with configuration Hash without 'bucket'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('bucket')

    @test_storage.should_receive(:config).and_return({:s3 => s3_config})

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /bucket/)
  end

end