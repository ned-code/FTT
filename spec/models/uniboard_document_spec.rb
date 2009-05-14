require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UniboardDocument do
  it('') { should be_built_by_factory }
  it('') { should be_created_by_factory }

  before(:each) do
    @user = Factory.create(:user)
    @document = Factory.create(:uniboard_document)
    @document.accepts_role 'owner', @user
  end

  it('') { should validate_format_of(:uuid, '12345678-1234-1234-1234-123456789012') }
  it('') { should_not validate_format_of(:uuid, 'another-string') }

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

  shared_examples_for 'document with filesystem storage' do

    before(:each) do
      UniboardDocument.config[:storage] = :filesystem
    end

  end

  shared_examples_for 'document with s3 storage' do

    before(:each) do
      UniboardDocument.config[:storage] = :s3
    end

  end

  context 'create' do

    shared_examples_for 'document create' do

      it 'should be valid with valid payload' do
        document = Factory.build(:uniboard_document)

        document.should be_valid
        document.should have(:no).errors
        document.save.should be_true
      end

      it 'should not be valid with empty paylod' do
        document = Factory.build(:uniboard_document, :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000000empty.ubz'))

        document.should_not be_valid
        document.should have(:no).errors_on(:uuid)
        document.should have(1).errors_on(:payload)
        document.save.should_not be_true
      end

      it 'should not be valid without valid paylod' do
        document = Factory.build(:uniboard_document, :payload => mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz'))

        document.should_not be_valid
        document.should have(:no).errors_on(:uuid)
        document.should have(1).errors_on(:payload)
        document.save.should_not be_true
      end

      it 'should not be valid without paylod' do
        document = Factory.build(:uniboard_document, :payload => nil)

        document.should_not be_valid
        document.should have(1).errors_on(:uuid)
        document.should have(1).errors_on(:payload)
        document.save.should_not be_true
      end

      it 'should not be valid with payload without valid UUID' do
        document = Factory.build(:uniboard_document, :payload =>  mock_uploaded_ubz('nouuid-valid.ubz'))

        document.should_not be_valid
        document.should have(1).errors_on(:uuid)
        document.should have(:no).errors_on(:payload)
        document.save.should_not be_true
      end

      it 'should create page on save' do
        document = Factory.build(:uniboard_document)

        document.save.should be_true
        document.should have(3).pages
        document.pages.each_with_index do |page, index|
          page.uuid.should == 'page%04d-0000-0000-0000-000000000000' % (index + 1)
          page.version.should == 1
          page.position.should == index + 1
        end
      end

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document create'

      it 'should save files on filesystem if document is valid' do
        document = Factory.build(:uniboard_document)

        document.save.should be_true

        Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, document.uuid)).should be_a_directory
        document.pages.each do |page|
          Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, document.uuid, "#{page.uuid}.svg")).should be_a_file
          Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, document.uuid, "#{page.uuid}.thumbnail.jpg")).should be_a_file
        end
        Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, document.uuid, 'images')).should be_a_directory
      end

      it 'should not save files on filesystem if document is not valid' do
        document = Factory.build(:not_valid_uniboard_document)

        document.save.should_not be_true

        Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, document.uuid)).should_not be_a_directory
      end

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document create'

      it 'should send files to s3 if document is valid' do
        document = Factory.build(:uniboard_document)

        mock_bucket = document.s3_config.bucket

        mock_bucket.should_not_receive(:keys)
        mock_bucket.should_receive(:key).exactly(9).times.and_return do
          mock_key = AppMocks::RightAws::S3::Key.new(mock_bucket, 'test.file')
          mock_key.should_receive(:put)
          mock_key
        end

        document.save.should be_true
      end

      it 'should not send files to s3 if document is not valid' do
        document = Factory.build(:not_valid_uniboard_document)

        mock_bucket = document.s3_config.bucket

        mock_bucket.should_not_receive(:keys)
        mock_bucket.should_not_receive(:key)

        document.save.should_not be_true
      end

    end
  end

  context 'recently created' do

    shared_examples_for 'document recently created' do

      it 'should have its version to 1' do
        document = Factory.build(:uniboard_document)

        document.should be_valid
        document.should have(:no).errors
        document.save.should be_true
        document.version.should == 1
      end

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document recently created'

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document recently created'

    end
  end

  context 'existing' do

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

  context 'update' do

    shared_examples_for 'document update' do

      it "should be valid with valid payload" do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)

        @document.should be_valid
        @document.should have(:no).errors
        @document.save.should be_true
      end

      it 'should increment updated page version' do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)

        @document.save.should be_true
        @document.reload

        @document.should have(3).pages
        @document.pages.each_with_index do |page, index|
          page.version.should == (index == 1 ? 2 : 1) # page 2 has been updated
          page.position.should == index + 1
        end
      end

      it 'should remove deleted page on save' do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-000000delete.ubz', @document.uuid)

        @document.save.should be_true
        @document.reload

        @document.should have(2).pages
        @document.pages.each_with_index do |page, index|
          page.version.should == 1
          page.position.should == index + 1
        end
      end

      it 'should not be valid if payload version is not equal to stored version' do
        @document.update_attribute(:version, @document.version + 1)
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)

        @document.should_not be_valid
        @document.should have(:no).errors_on(:uuid)
        @document.should have(1).error_on(:version)
        @document.should have(:no).errors_on(:payload)
        @document.save.should_not be_true
      end

      it 'should not be valid if payload is not valid' do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz', @document.uuid)

        @document.should_not be_valid
        @document.should have(:no).errors_on(:uuid)
        @document.should have(:no).error_on(:version)
        @document.should have(1).errors_on(:payload)
        @document.save.should_not be_true
      end

      it 'should not be valid if payload UUID is not valid' do
        @document.payload = mock_uploaded_ubz('nouuid-valid.ubz')

        @document.should_not be_valid
        @document.should have(2).errors_on(:uuid)
        @document.should have(:no).error_on(:version)
        @document.should have(:no).errors_on(:payload)
        @document.save.should_not be_true
      end

      it 'should not be valid if payload UUID is not equal to document UUID' do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz')

        @document.should_not be_valid
        @document.should have(1).errors_on(:uuid)
        @document.should have(:no).error_on(:version)
        @document.should have(:no).errors_on(:payload)
        @document.save.should_not be_true
      end

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document update'

      it 'should save files on filesystem if document is valid' do
        Dir[File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, '*')].each do |file|
          FileUtils.rm_rf file
        end

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)
        @document.save.should be_true

        @document.pages.each_with_index do |page, index|
          if index == 1 # Updated page index
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.svg")).should be_a_file
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.thumbnail.jpg")).should be_a_file
          else
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.svg")).should_not be_a_file
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.thumbnail.jpg")).should_not be_a_file
          end
        end
      end

      it 'should not save files on filesystem if document is not valid' do
        Dir[File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, '*')].each do |file|
          FileUtils.rm_rf file
        end

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz', @document.uuid)
        @document.save.should_not be_true

        @document.pages.each_with_index do |page, index|
          Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.svg")).should_not be_a_file
          Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.thumbnail.jpg")).should_not be_a_file
        end
      end

      it 'should remove deleted files on filesystem' do
        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-000000delete.ubz', @document.uuid)
        @document.save.should be_true

        @document.pages.each_with_index do |page, index|
          if index == 1 # Deleted page index
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.svg")).should_not be_a_file
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.thumbnail.jpg")).should_not be_a_file
          else
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.svg")).should be_a_file
            Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid, "#{page.uuid}.thumbnail.jpg")).should be_a_file
          end
        end
      end

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document update'

      it 'should send files to s3 if document if document is valid' do
        mock_bucket = @document.s3_config.bucket

        mock_bucket.should_not_receive(:keys)
        mock_bucket.should_receive(:key).exactly(2).times.and_return do
          mock_key = AppMocks::RightAws::S3::Key.new(mock_bucket, 'test.file')
          mock_key.should_receive(:put)
          mock_key
        end

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0update1page.ubz', @document.uuid)
        @document.save.should be_true
      end

      it 'should not send files to s3 if document is not valid' do
        mock_bucket = @document.s3_config.bucket

        mock_bucket.should_not_receive(:keys)
        mock_bucket.should_not_receive(:key)

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz', @document.uuid)
        @document.save.should_not be_true
      end

      it 'should remove deleted files on s3' do
        mock_bucket = @document.s3_config.bucket
        deleted_page_uuid = @document.pages[1].uuid

        mock_bucket.should_receive(:keys).with(
          :prefix => "documents/#{@document.uuid}/#{deleted_page_uuid}"
        ).and_return do
          mock_key = AppMocks::RightAws::S3::Key.new(mock_bucket, 'test.file')
          mock_key.should_receive(:delete)
          [mock_key]
        end
        mock_bucket.should_not_receive(:key)

        @document.payload = mock_uploaded_ubz('00000000-0000-0000-0000-000000delete.ubz', @document.uuid)
        @document.save.should be_true
      end

    end
  end

  context 'recently updated' do

    shared_examples_for 'document recently updated' do

      it 'should have its version incremented' do
        previous_version = @document.version

        @document.save.should be_true
        @document.version.should == previous_version + 1
      end

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document recently updated'

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document recently updated'

    end

  end

  context 'delete' do

    shared_examples_for 'document delete' do

      it "should be deleted" do
        @document.destroy.should be_true

        @document.should be_deleted
        UniboardDocument.find_by_id(@document.id).should be_nil
        UniboardDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil

        @document.pages.each do |page|
          UniboardPage.find_by_id(page.id).should be_nil
        end
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

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document delete'

      it 'should remove files on filesystem' do
        @document.destroy.should be_true

        Pathname.new(File.join(Storage::Filesystem::Configuration.config.basedir, @document.uuid)).should_not be_a_directory
      end

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document delete'

      it 'should remove files on s3' do
        mock_bucket = @document.s3_config.bucket

        mock_bucket.should_receive(:keys).with(:prefix => "documents/#{@document.uuid}").and_return do
          mock_key = AppMocks::RightAws::S3::Key.new(mock_bucket, 'test.file')
          mock_key.should_receive(:delete)
          [mock_key]
        end
        mock_bucket.should_not_receive(:key)

        @document.destroy.should be_true
      end

    end
  end

  context 'recently deleted' do

    shared_examples_for 'document recently deleted' do

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

    end

    context 'with filesystem storage' do
      it_should_behave_like 'document with filesystem storage'
      it_should_behave_like 'document recently deleted'

    end

    context 'with s3 storage' do
      it_should_behave_like 'document with s3 storage'
      it_should_behave_like 'document recently deleted'

    end
  end

  describe 'collection' do

    before(:each) do
      @document_deleted = Factory.create(:uniboard_document)
      @document_deleted.accepts_role 'owner', @user
      @document_deleted.destroy

      @document_not_owned = Factory.create(:uniboard_document)
      @document_not_owned.accepts_role 'owner', Factory.create(:user)
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

end
