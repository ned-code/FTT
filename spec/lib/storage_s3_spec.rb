require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'storage/s3'

class TestStorage

  Configuration = Struct.new(:storage, :storage_config)

  def config
   @config ||= Configuration.new(
        :storage => :filesystem,
        :storage_config => {}
      )
  end
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

  after(:each) do
    # Reset s3 config
    Storage::S3::Configuration.class_eval do
      class_variable_set(:@@config, nil)
    end
  end

  it 'Configuration should not raise error with valid configuration Hash' do
    s3_config = @valid_s3_config.dup

    @test_storage.config.should_receive(:storage_config).and_return(s3_config)

    @test_storage.s3_config.should be_a_kind_of(Storage::S3::Configuration)
  end

  it "Configuration should raise error with configuration Hash without 'access_key_id'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('access_key_id')

    @test_storage.config.should_receive(:storage_config).and_return(s3_config)

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /access_key_id/)
  end

  it "Configuration should raise error with configuration Hash without 'secret_access_key'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('secret_access_key')

    @test_storage.config.should_receive(:storage_config).and_return(s3_config)

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /secret_access_key/)
  end

  it "Configuration should raise error with configuration Hash without 'bucket'" do
    s3_config = @valid_s3_config.dup
    s3_config.delete('bucket')

    @test_storage.config.should_receive(:storage_config).and_return(s3_config)

    lambda { @test_storage.s3_config }.should raise_error(ArgumentError, /bucket/)
  end

end