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

  it 'should be valid with valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should be_valid
  end

  it 'should not be valid with empty ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000000empty.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid with not valid ubz file' do
    document = Factory.build(:empty_uniboard_document)

    document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')
    document.should have(:no).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid with nil file' do
    document = Factory.build(:uniboard_document, :payload => nil)

    document.payload = nil
    document.should have(1).errors_on(:uuid)
    document.should have(1).errors_on(:file)
    document.should_not be_valid
  end

  it 'should not be valid without uuid' do
    document = Factory.build(:uniboard_document, :payload => nil)

    document.payload = mock_uploaded_ubz('nouuid-valid.ubz')
    document.should have(1).errors_on(:uuid)
    document.should have(:no).errors_on(:file)
    document.should_not be_valid
  end

  context '(new)' do
    it 'should send file to s3 on save' do
      document = Factory.build(:empty_uniboard_document)
      document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

      AWS::S3::S3Object.should_not_receive(:delete)
      # TODO: Can test argument with regex ?
      AWS::S3::S3Object.should_receive(:store).exactly(9).times

      document.save.should be_true
      document.should have(3).pages(true)
      document.pages[0].version.should == 1
      document.pages[1].version.should == 1
      document.pages[2].version.should == 1
      document.pages[0].position.should == 1
      document.pages[1].position.should == 2
      document.pages[2].position.should == 3
    end
  end

  context '(update)' do
    it 'should send updated pages to s3 on save' do
      document = Factory.create(:uniboard_document)

      AWS::S3::S3Object.should_not_receive(:delete)
      # TODO: Can test argument with regex ?
      AWS::S3::S3Object.should_receive(:store).exactly(2).times

      document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', document.uuid)
      document.save.should be_true
      document.should have(3).pages(true)
      document.pages[0].version.should == 1
      document.pages[1].version.should == 2
      document.pages[2].version.should == 1
      document.pages[0].position.should == 1
      document.pages[1].position.should == 2
      document.pages[2].position.should == 3
    end

    it 'should remove deleted pages on s3 on save' do
      document = Factory.create(:uniboard_document)
      deleted_page = document.pages[1]

      # TODO: Can test argument with regex ?
      AWS::S3::S3Object.should_receive(:delete).exactly(2).times
      AWS::S3::S3Object.should_not_receive(:store)

      document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-000000delete.ubz', document.uuid)
      document.save.should be_true
      document.should have(2).pages(true)
      document.pages[0].version.should == 1
      document.pages[1].version.should == 1
      document.pages[0].position.should == 1
      document.pages[1].position.should == 2
      UniboardPage.find_by_id(deleted_page.id).should be_nil
    end

    it 'should not be valid if UUID change' do
      document = Factory.create(:uniboard_document,
        :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')
      )

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_not_receive(:store)

      document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')
      document.should have(1).errors_on(:uuid)
      document.should have(:no).errors_on(:version)
      document.should have(:no).errors_on(:file)
      document.should_not be_valid
      document.save.should be_false
    end

    it 'should not be valid if document version have already changed' do
      document = Factory.create(:uniboard_document,
        :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')
      )
      document.update_attribute(:version, document.version + 1)

      AWS::S3::S3Object.should_not_receive(:delete)
      AWS::S3::S3Object.should_not_receive(:store)

      document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', document.uuid)
      document.should have(:no).errors_on(:uuid)
      document.should have(1).errors_on(:version)
      document.should have(:no).errors_on(:file)
      document.should_not be_valid
      document.save.should be_false
    end
  end

  it 'should be marked destroyed' do
    document = Factory.create(:uniboard_document)
    document.accepts_role 'owner', Factory.create(:user)

    AWS::S3::Bucket.should_receive(:objects).with(document.bucket, :prefix => "documents/#{document.uuid}").and_return(
      stub('list', :collect => [
        "documents/#{document.uuid}/images/00000000-0000-0000-0000-000000000001.jpg",
        "documents/#{document.uuid}/images/00000000-0000-0000-0000-000000000002.jpg",
        "documents/#{document.uuid}/metadata.rdf",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000001.svg",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000001.thumbnail.jpg",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000002.svg",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000002.thumbnail.jpg",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000003.svg",
        "documents/#{document.uuid}/00000000-0000-0000-0000-000000000004.thumbnail.jpg"
      ])
    )

    # TODO: Can test argument with regex ?
    AWS::S3::S3Object.should_receive(:delete).exactly(9).times

    document.destroy.should be_true
    document.should be_deleted

    document.pages.each do |page|
      UniboardPage.find_by_id(page.id).should be_nil
    end

    UniboardDocument.find_by_id(document.id).should be_nil

    document = UniboardDocument.find_by_id(document.id, :with_deleted => true)
    document.should_not be_nil
    document.should be_deleted
  end

  it 'should be directly destroyed' do
    document = Factory.create(:uniboard_document)
    document.accepts_role 'owner', Factory.create(:user)

    document.destroy!.should be_true

    document.pages.each do |page|
      UniboardPage.find_by_id(page.id).should be_nil
    end

    UniboardDocument.find_by_id(document.id, :with_deleted => true).should be_nil
  end

  it 'should be destroyed after marked destroyed' do
    document = Factory.create(:uniboard_document)
    document.accepts_role 'owner', Factory.create(:user)

    document.destroy.should be_true
    document.destroy!.should be_true

    document.pages.each do |page|
      UniboardPage.find_by_id(page.id).should be_nil
    end

    UniboardDocument.find_by_id(document.id, :with_deleted => true).should be_nil
  end

  it 'should be destroyed from owner list' do
    user = Factory.create(:user)

    document = Factory.create(:uniboard_document)
    document.accepts_role 'owner', user

    user.documents.first.destroy!.should be_true

    document.pages.each do |page|
      UniboardPage.find_by_id(page.id).should be_nil
    end

    UniboardDocument.find_by_id(document.id, :with_deleted => true).should be_nil
  end

  describe 'owner should retrive document' do

    before(:each) do
      @user = Factory.create(:user)

      @document = Factory.create(:uniboard_document)
      @document.accepts_role 'owner', @user

      @document_deleted = Factory.create(:uniboard_document)
      @document_deleted.accepts_role 'owner', @user
      @document_deleted.destroy

      @document_not_owned = Factory.create(:uniboard_document)
    end

    it 'owner should retrive document (without deleted)' do
      @user.documents.should include(@document)
      @user.documents.should_not include(@document_deleted)
      @user.documents.should_not include(@document_not_owned)
    end

    it 'owner should retrive document (with deleted)' do
      @user.documents(:with_deleted => true).should include(@document)
      @user.documents(:with_deleted => true).should include(@document_deleted)
      @user.documents(:with_deleted => true).should_not include(@document_not_owned)
    end
  end

  it "should have xml format (with page url)" do
    document = Factory.create(:uniboard_document)
    document_xml = REXML::Document.new(document.to_xml(:page_url => true))

    document_xml.root.name.should == 'document'
    document_xml.root.attributes.to_hash.should include(
      'xmlns' => 'http://www.mnemis.com/uniboard',
      'uuid' => document.uuid,
      'version' => document.version.to_s,
      'created-at' => document.created_at.xmlschema,
      'updated-at' => document.updated_at.xmlschema
    )

    document.pages.each do |page|
      document_xml.root.should have(1).elements
      document_xml.root.get_elements('pages').first.should have(document.pages.count).elements

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
    document = Factory.create(:uniboard_document)
    document_xml = REXML::Document.new(document.to_xml)

    document_xml.root.name.should == 'document'
    document_xml.root.attributes.to_hash.should include(
      'xmlns' => 'http://www.mnemis.com/uniboard',
      'uuid' => document.uuid,
      'version' => document.version.to_s,
      'created-at' => document.created_at.xmlschema,
      'updated-at' => document.updated_at.xmlschema
    )

    document.pages.each do |page|
      document_xml.root.should have(1).elements
      document_xml.root.get_elements('pages').first.should have(document.pages.count).elements

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
