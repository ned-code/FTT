require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardDocument do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it 'should establish connection to s3 if not connected' do
    AWS::S3::Base.should_receive(:connected?).and_return(false)
    AWS::S3::Base.should_receive(:establish_connection!)

    UniboardDocument.new
  end

  it 'should not establish connection to s3 if connected' do
    AWS::S3::Base.should_receive(:connected?).and_return(true)
    AWS::S3::Base.should_not_receive(:establish_connection!)

    UniboardDocument.new
  end

  context '(new)' do
    it 'should send file to s3 on save' do
      document = Factory.build(:uniboard_document)
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'test.ubz')

      AWS::S3::S3Object.should_not_receive(:delete).and_return(true)
      AWS::S3::S3Object.should_receive(:store).exactly(12).times

      document.save.should be_true
    end
  end
end
