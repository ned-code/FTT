require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardDocument do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  before(:each) do
    @user = Factory.create(:user)
    @document = Factory.create(:uniboard_document)
    @document.accepts_role 'owner', @user
  end
  
  context 'creation' do

    it 'should be valid with valid payload' do
      document = Factory.build(:uniboard_document)

      document.should be_valid
      document.should have(:no).errors
      document.save.should be_true
    end

    it 'should have its version to 1' do
      document = Factory.build(:uniboard_document)

      document.should be_valid
      document.should have(:no).errors
      document.save.should be_true
      document.version.should == 1
    end

    it 'should not be valid with empty paylod' do
      document = Factory.build(:uniboard_document, :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000000empty.ubz'))

      document.should_not be_valid
      document.should have(:no).errors_on(:uuid)
      document.should have(1).errors_on(:file)
      document.save.should_not be_true
    end

    it 'should not be valid without valid paylod' do
      document = Factory.build(:uniboard_document, :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz'))

      document.should_not be_valid
      document.should have(:no).errors_on(:uuid)
      document.should have(1).errors_on(:file)
      document.save.should_not be_true
    end

    it 'should not be valid without paylod' do
      document = Factory.build(:uniboard_document, :payload => nil)

      document.should_not be_valid
      document.should have(1).errors_on(:uuid)
      document.should have(1).errors_on(:file)
      document.save.should_not be_true
    end

    it 'should not be valid with payload without valid UUID' do
      document = Factory.build(:uniboard_document, :payload =>  mock_uploaded_ubz('nouuid-valid.ubz'))

      document.should_not be_valid
      document.should have(1).errors_on(:uuid)
      document.should have(:no).errors_on(:file)
      document.save.should_not be_true
    end

    context 'with s3 storage' do

      it 'should send files to s3 on save' do
        document = Factory.build(:uniboard_document)

        AWS::S3::S3Object.should_not_receive(:delete)
        AWS::S3::S3Object.should_receive(:store).exactly(9).times

        document.save.should be_true
      end

    end

    context 'with s3 storage' do

      it 'should send files to s3 if document if document is valid' do
        document = Factory.build(:uniboard_document)

        AWS::S3::S3Object.should_not_receive(:delete)
        AWS::S3::S3Object.should_receive(:store).exactly(9).times

        document.save.should be_true
      end

      it 'should not send files to s3 if document is not valid' do
        document = Factory.build(:uniboard_document)

        AWS::S3::S3Object.should_not_receive(:delete)
        AWS::S3::S3Object.should_not_receive(:store)
        document.stub(:valid?).and_return(false)

        document.save.should_not be_true
      end

    end
  end

  context 'update' do

    it "should be valid with valid payload" do
      @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)

      @document.should be_valid
      @document.should have(:no).errors
      @document.save.should be_true
    end

    it 'should have its version incremented' do
      previous_version = @document.version

      @document.save.should be_true
      @document.version.should == previous_version + 1
    end

    it 'should not be valid if payload version is not equal to stored version' do
      @document.update_attribute(:version, @document.version + 1)
      @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)

      @document.should_not be_valid
      @document.should have(:no).errors_on(:uuid)
      @document.should have(1).error_on(:version)
      @document.should have(:no).errors_on(:file)
      @document.save.should_not be_true
    end

    it 'should not be valid if payload is not valid' do
      @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz', @document.uuid)

      @document.should_not be_valid
      @document.should have(:no).errors_on(:uuid)
      @document.should have(:no).error_on(:version)
      @document.should have(1).errors_on(:file)
      @document.save.should_not be_true
    end

    it 'should not be valid if payload UUID is not valid' do
      @document.payload = mock_uploaded_ubz('nouuid-valid.ubz')

      @document.should_not be_valid
      @document.should have(2).errors_on(:uuid)
      @document.should have(:no).error_on(:version)
      @document.should have(:no).errors_on(:file)
      @document.save.should_not be_true
    end

    it 'should not be valid if payload UUID is not equal to document UUID' do
      @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz')

      @document.should_not be_valid
      @document.should have(1).errors_on(:uuid)
      @document.should have(:no).error_on(:version)
      @document.should have(:no).errors_on(:file)
      @document.save.should_not be_true
    end

    it "should be deleted" do
      @document.destroy.should be_true

      @document.should be_deleted
      UniboardDocument.find_by_id(@document.id).should be_nil
      UniboardDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil
      UniboardPage.find(:all, :conditions => {:uniboard_document_id => @document.id}).should be_empty
    end

    it "should be really deleted" do
      @document.destroy!.should be_true

      @document.should be_deleted
      UniboardDocument.find_by_id(@document.id).should be_nil
      UniboardDocument.find_by_id(@document.id, :with_deleted => true).should be_nil

      @document.pages.each do |page|
        UniboardPage.find_by_id(page.id).should be_nil
      end
    end

    it 'should be really deleted after "marked" deleted' do
      @document.destroy.should be_true
      @document = UniboardDocument.find(@document.id, :with_deleted => true)

      @document.destroy!.should be_true

      @document.should be_deleted
      UniboardDocument.find_by_id(@document.id).should be_nil
      UniboardDocument.find_by_id(@document.id, :with_deleted => true).should be_nil

      @document.pages.each do |page|
        UniboardPage.find_by_id(page.id).should be_nil
      end
    end

    context 'with s3 storage' do

      it 'should send files to s3' do
        AWS::S3::S3Object.should_not_receive(:delete)
        AWS::S3::S3Object.should_receive(:store).exactly(2).times

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)
        @document.save.should be_true
      end

      it 'should remove deleted files on s3' do
        AWS::S3::S3Object.should_receive(:delete).exactly(2).times
        AWS::S3::S3Object.should_not_receive(:store)

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-000000delete.ubz', @document.uuid)
        @document.save.should be_true
      end

      it 'should not send files to s3 on update if document is not valid' do
        AWS::S3::S3Object.should_not_receive(:delete)
        AWS::S3::S3Object.should_not_receive(:store)
        @document.stub(:valid?).and_return(false)

        @document.save.should_not be_true
      end

    end
  end

  context 'deletion' do

    context 'with s3 storage' do

      it 'should remove files on s3' do
        AWS::S3::S3Object.should_receive(:delete).exactly(9).times
        AWS::S3::S3Object.should_not_receive(:store)

        AWS::S3::Bucket.should_receive(:objects).with(@document.bucket, :prefix => "documents/#{@document.uuid}").and_return(
          stub('list', :collect => [
            "documents/#{@document.uuid}/images/00000000-0000-0000-0000-000000000001.jpg",
            "documents/#{@document.uuid}/images/00000000-0000-0000-0000-000000000002.jpg",
            "documents/#{@document.uuid}/metadata.rdf",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000001.svg",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000001.thumbnail.jpg",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000002.svg",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000002.thumbnail.jpg",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000003.svg",
            "documents/#{@document.uuid}/00000000-0000-0000-0000-000000000004.thumbnail.jpg"
          ])
        )

        @document.destroy.should be_true
      end

    end
  end

  describe 'collection' do

    before(:each) do
      @document_deleted = Factory.create(:uniboard_document)
      @document_deleted.accepts_role 'owner', @user
      @document_deleted.destroy

      @document_not_owned = Factory.create(:uniboard_document)
      @document_deleted.accepts_role 'owner', Factory.create(:user)
    end

    it 'should be retrived without deleted' do
      collection = UniboardDocument.all
      
      collection.should include(@document)
      collection.should_not include(@document_deleted)
      collection.should include(@document_not_owned)
    end

    it 'should be retrived with deleted' do
      collection = UniboardDocument.all(:with_deleted => true)

      collection.should include(@document)
      collection.should include(@document_deleted)
      collection.should include(@document_not_owned)
    end

    it 'should be retrived from owner (without deleted)' do
      collection = @user.documents

      collection.should include(@document)
      collection.should_not include(@document_deleted)
      collection.should_not include(@document_not_owned)
    end

    it 'should be retrived from owner (with deleted)' do
      collection = @user.documents(:with_deleted => true)

      collection.should include(@document)
      collection.should include(@document_deleted)
      collection.should_not include(@document_not_owned)
    end
  end

  it "should have xml format (with page url)" do
    document_xml = REXML::Document.new(@document.to_xml(:page_url => true))

    document_xml.root.name.should == 'document'
    document_xml.root.attributes.to_hash.should include(
      'xmlns' => 'http://www.mnemis.com/uniboard',
      'uuid' => @document.uuid,
      'version' => @document.version.to_s,
      'created-at' => @document.created_at.xmlschema,
      'updated-at' => @document.updated_at.xmlschema
    )

    @document.pages.each do |page|
      document_xml.root.should have(1).elements
      document_xml.root.get_elements('pages').first.should have(@document.pages.count).elements

      document_xml.root.get_elements('pages').first.each_element_with_attribute('uuid', page.uuid) do |page_element|
        page_element.name.should == 'page'
        page_element.attributes.to_hash.should include(
          'version' => page.version.to_s,
          'created-at' => page.created_at.xmlschema,
          'updated-at' => page.updated_at.xmlschema
        )
        page_element.text.should_not be_blank
      end
    end
  end

  it "should have xml format (without page url)" do
    document_xml = REXML::Document.new(@document.to_xml)

    document_xml.root.name.should == 'document'
    document_xml.root.attributes.to_hash.should include(
      'xmlns' => 'http://www.mnemis.com/uniboard',
      'uuid' => @document.uuid,
      'version' => @document.version.to_s,
      'created-at' => @document.created_at.xmlschema,
      'updated-at' => @document.updated_at.xmlschema
    )

    @document.pages.each do |page|
      document_xml.root.should have(1).elements
      document_xml.root.get_elements('pages').first.should have(@document.pages.count).elements

      document_xml.root.get_elements('pages').first.each_element_with_attribute('uuid', page.uuid) do |page_element|
        page_element.name.should == 'page'
        page_element.attributes.to_hash.should include(
          'version' => page.version.to_s,
          'created-at' => page.created_at.xmlschema,
          'updated-at' => page.updated_at.xmlschema
        )
        page_element.text.should be_blank
      end
    end
  end

end
