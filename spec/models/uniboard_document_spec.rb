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

  it 'should accept ubz file' do
    document = Factory.build(:uniboard_document)

    lambda do
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'valid.ubz')
    end.should_not raise_error(ArgumentError)
  end

  it 'should not accept text file' do
    document = Factory.build(:uniboard_document)

    lambda do
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'empty.txt')
    end.should raise_error(ArgumentError)
  end

  it 'should not accept empty ubz file' do
    document = Factory.build(:uniboard_document)

    lambda do
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'empty.ubz')
    end.should raise_error(ArgumentError)
  end

  it 'should not accept not valid ubz file' do
    document = Factory.build(:uniboard_document)

    lambda do
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'no-valid.ubz')
    end.should raise_error(ArgumentError)
  end


  context '(new)' do
    it 'should send file to s3 on save' do
      document = Factory.build(:uniboard_document)
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'valid.ubz')

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_receive(:store).exactly(10).times

      document.save.should be_true
    end
  end

  context '(update)' do
    it 'should send file to s3 on save' do
      document = Factory.create(:uniboard_document)
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'valid.ubz')

      AWS::S3::Bucket.should_receive(:objects).with(document.bucket, :prefix => document.uuid).and_return(
        stub('list', :collect => [
          "#{document.uuid}.ubz",
          "#{document.uuid}/images/file.jpeg",
          "#{document.uuid}/images/file.jpeg",
          "#{document.uuid}/metadata.rdf",
          "#{document.uuid}/page_001.svg",
          "#{document.uuid}/page_001_preview.svg",
          "#{document.uuid}/page_002.svg",
          "#{document.uuid}/page_002_preview.svg",
          "#{document.uuid}/page_003.svg",
          "#{document.uuid}/page_002_preview.svg"
        ])
      )

      AWS::S3::S3Object.should_receive(:delete).exactly(9).times
      AWS::S3::S3Object.should_receive(:store).exactly(10).times

      document.save.should be_true
    end
  end
end
