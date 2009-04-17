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

  it 'should be valid with String object as file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should be valid with UploadFile object as file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should be valid with default UploadFile object as file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = mock_uploaded_ubz
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should be valid with File object as file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.open(File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz'))
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should be valid with valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should not be valid with empty text file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000empty.txt')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid with empty ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000empty.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid with not valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000notvalid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end
  
  it 'should not be valid with nil file' do
    document = Factory.build(:uniboard_document, :file => nil)

    document.file = nil
    document.should have(1).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid without uuid' do
    document = Factory.build(:uniboard_document, :file => nil)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'nouuid-valid.ubz')
    document.should have(1).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid without uuid and valid file' do
    document = Factory.build(:uniboard_document, :file => nil)

    document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'nouuid-notvalid.ubz')
    document.should have(1).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  context '(new)' do
    it 'should send file to s3 on save' do
      document = Factory.build(:empty_uniboard_document)
      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_receive(:store).exactly(10).times

      document.save.should be_true
    end
  end

  context '(update)' do
    it 'should send file to s3 on save' do
      document = Factory.create(:uniboard_document)

      AWS::S3::Bucket.should_receive(:objects).with(document.bucket, :prefix => document.uuid).and_return(
        stub('list', :collect => [
          "#{document.uuid}.ubz",
          "#{document.uuid}/images/image_1.jpeg",
          "#{document.uuid}/images/image_2.jpeg",
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

      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')
      document.save.should be_true
    end

    it 'should not be valid if UUID change' do
      document = Factory.create(:uniboard_document,
        :file => File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')
      )

      document.file = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '10000000-0000-0000-0000-0000000valid.ubz')
      document.should have(1).errors_on(:uuid)
      document.should have(:no).errors_on(:file)
      document.should_not be_valid
    end
  end

  it 'should have url' do
    document = Factory.create(:uniboard_document)

    AWS::S3::S3Object.should_receive(:url_for).with("#{document.uuid}.ubz", document.bucket).and_return('http://amazone')
    
    document.url.should == 'http://amazone'
  end

  it 'should be destroyed' do
    document = Factory.create(:uniboard_document)

      AWS::S3::Bucket.should_receive(:objects).with(document.bucket, :prefix => document.uuid).and_return(
        stub('list', :collect => [
          "#{document.uuid}.ubz",
          "#{document.uuid}/images/image_1.jpeg",
          "#{document.uuid}/images/image_2.jpeg",
          "#{document.uuid}/metadata.rdf",
          "#{document.uuid}/page_001.svg",
          "#{document.uuid}/page_001_preview.svg",
          "#{document.uuid}/page_002.svg",
          "#{document.uuid}/page_002_preview.svg",
          "#{document.uuid}/page_003.svg",
          "#{document.uuid}/page_002_preview.svg"
        ])
      )

    AWS::S3::S3Object.should_receive(:delete).exactly(10).times

    document.destroy
  end
end
