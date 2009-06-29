require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbDocument do
  it('') { should be_built_by_factory }
  it('') { should be_created_by_factory }

  before(:each) do
    @storage = Storage.storage(:name => :filesystem)
    @user = Factory.create(:user)
    @document = Factory.create(:ub_document)
    @document.accepts_role 'owner', @user
  end

  it('') { should allow_values_for(:uuid, '12345678-1234-1234-1234-123456789012') }
  it('') { should_not allow_values_for(:uuid, 'another-string') }

  it('') { should have_many(:pages,
      :order => 'position ASC',
      :autosave => true,
      :dependent => :destroy)
  }

  it('') { should have_default_scope(
      :order => "updated_at DESC",
      :conditions => {:deleted_at => nil},
      :include => [:pages])
  }

  context 'create' do

  end

  context 'recently created' do

    it 'should have its version to 1' do
      document = Factory.build(:ub_document)

      document.should be_valid
      document.should have(:no).errors
      document.save.should be_true
      document.version.should == 1
    end

  end

  context 'existing' do

    it "should have xml format (with page url)" do
      document_xml = REXML::Document.new(@document.to_xml(:page_url => true))

      document_xml.root.name.should == 'document'
      document_xml.root.attributes.to_hash.should include(
        'xmlns' => 'http://uniboard.mnemis.com/document',
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
        'xmlns' => 'http://uniboard.mnemis.com/document',
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

  context 'update' do

    before(:each) do
      rdf_media = Factory.create(:ub_media)
      rdf_path = "#{@document.uuid}/metadata.rdf"
      @storage.put(rdf_path, File.open(fixture_file("ub_document/default_rdf.rdf")))
      rdf_media.uuid = @document.uuid
      rdf_media.path = rdf_path
      rdf_media.storage_config = @storage.to_s
      rdf_media.save
    end

    it 'should update metadata and increment version if metadata are modified' do
      @document.pages.build(:uuid => "00000000-0000-0000-0000-000000000001")
      @document.save
      previous_version = @document.version
      ub_file = File.open(fixture_file(File.join("ub_document", "default_ub.ub")))
      @document.update_with_ub(ub_file, [@document.uuid])
      @document.title.should == "Document title"
      @document.version.should == previous_version + 1
    end
  end

  context 'delete' do

    it "should be deleted" do
      @document.destroy.should be_true

      @document.should be_deleted
      UbDocument.find_by_id(@document.id).should be_nil
      UbDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil

      @document.pages.each do |page|
        UbPage.find_by_id(page.id).should be_nil
      end
    end

    it "should be really deleted" do
      @document.destroy!.should be_true

      @document.should be_deleted
      UbDocument.find_by_id(@document.id).should be_nil
      UbDocument.find_by_id(@document.id, :with_deleted => true).should be_nil

      @document.pages.each do |page|
        UbPage.find_by_id(page.id).should be_nil
      end
    end

  end

  context 'recently deleted' do

    it 'should be really deleted after "marked" deleted' do
      @document.destroy.should be_true
      @document = UbDocument.find(@document.id, :with_deleted => true)

      @document.destroy!.should be_true

      @document.should be_deleted
      UbDocument.find_by_id(@document.id).should be_nil
      UbDocument.find_by_id(@document.id, :with_deleted => true).should be_nil

      @document.pages.each do |page|
        UbPage.find_by_id(page.id).should be_nil
      end
    end

  end

  describe 'collection' do

    before(:each) do
      @document_deleted = Factory.create(:ub_document)
      @document_deleted.accepts_role 'owner', @user
      @document_deleted.destroy

      @document_not_owned = Factory.create(:ub_document)
      @document_not_owned.accepts_role 'owner', Factory.create(:user)
    end

    it 'should be retrived without deleted' do
      collection = UbDocument.all

      collection.should include(@document)
      collection.should_not include(@document_deleted)
      collection.should include(@document_not_owned)
    end

    it 'should be retrived with deleted' do
      collection = UbDocument.all(:with_deleted => true)

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

end
