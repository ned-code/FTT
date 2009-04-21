require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardDocument do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it "version number is initialized on create" do
    document = Factory.build(:uniboard_document)

    document.save.should be_true
    document.version.should == 1
  end

  it "version number is incremented on update" do
    document = Factory.create(:uniboard_document)

    document.save.should be_true
    document.version.should == 2
  end

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

    document.file = fixture_file('00000000-0000-0000-0000-0000000valid.ubz')
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

  it 'should be valid with File object as file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = File.open(fixture_file('00000000-0000-0000-0000-0000000valid.ubz'))
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should be valid with valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = fixture_file('00000000-0000-0000-0000-0000000valid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should not be valid with empty ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file =fixture_file('00000000-0000-0000-0000-0000000empty.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid with not valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.file = fixture_file('00000000-0000-0000-0000-0000notvalid.ubz')
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

    document.file = fixture_file('nouuid-valid.ubz')
    document.should have(1).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should_not be_valid
  end

  context '(new)' do
    it 'should send file to s3 on save' do
      document = Factory.build(:empty_uniboard_document)
      document.file = fixture_file('00000000-0000-0000-0000-0000000valid.ubz')

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_receive(:store).exactly(9).times

      document.save.should be_true
      document.should have(3).pages
    end
  end

  context '(update)' do
    it 'should send updated pages to s3 on save' do
      document = Factory.create(:uniboard_document)

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_receive(:store).exactly(4).times

      document.file = fixture_file('00000000-0000-0000-0000-0update1page.ubz', document.uuid)
      document.save.should be_true
      document.should have(3).pages
      document.pages[0].version.should == 1
      document.pages[1].version.should == 2
      document.pages[2].version.should == 1
    end

#    it 'should remove deleted pages on s3 on save' do
#      document = Factory.create(:uniboard_document)
#
#      AWS::S3::Bucket.should_receive(:objects).with(document.bucket, :prefix => document.uuid).and_return(
#        stub('list', :collect => [
#          "#{document.uuid}.ubz",
#          "#{document.uuid}/#{document.uuid}.ub",
#          "#{document.uuid}/metadata.rdf",
#          "#{document.uuid}/page_001.svg",
#          "#{document.uuid}/page_001_preview.svg",
#        ])
#      )
#
#      AWS::S3::S3Object.should_receive(:delete).exactly(4).times
#      AWS::S3::S3Object.should_receive(:store).exactly(5).times
#
#      document.file = fixture_file('00000000-0000-0000-0000-000000update.ubz', document.uuid)
#      document.save.should be_true
#      document.should have(3).pages
#    end

    it 'should not be valid if UUID change' do
      document = Factory.create(:uniboard_document,
        :file => fixture_file('00000000-0000-0000-0000-0000000valid.ubz')
      )

      document.file = fixture_file('00000000-0000-0000-0000-0000000valid.ubz')
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
        "#{document.uuid}/images/00000000-0000-0000-0000-000000000001.jpeg",
        "#{document.uuid}/images/00000000-0000-0000-0000-000000000002.jpeg",
        "#{document.uuid}/metadata.rdf",
        "#{document.uuid}/00000000-0000-0000-0000-000000000001.svg",
        "#{document.uuid}/00000000-0000-0000-0000-000000000001.thumbnail.svg",
        "#{document.uuid}/00000000-0000-0000-0000-000000000002.svg",
        "#{document.uuid}/00000000-0000-0000-0000-000000000002.thumbnail.svg",
        "#{document.uuid}/00000000-0000-0000-0000-000000000003.svg",
        "#{document.uuid}/00000000-0000-0000-0000-000000000004.thumbnail.svg"
      ])
    )

    AWS::S3::S3Object.should_receive(:delete).exactly(9).times

    document.destroy.should be_true
    document.pages.each do |page|
      UniboardPage.find_by_id(page.id).should be_nil
    end
  end

  it 'should be listed by owner' do
    user = Factory.create(:user)

    document_not_owned = Factory.create(:uniboard_document)

    document = Factory.create(:uniboard_document)
    document.accepts_role 'owner', user

    user.documents.should include(document)
    user.documents.should_not include(document_not_owned)
  end
end
