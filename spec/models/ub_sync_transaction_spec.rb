require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbSyncTransaction do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it { should have_many(:items) }

  it { should validate_presence_of(:uuid) }
  it { should validate_presence_of(:ub_client_uuid) }
  it { should validate_presence_of(:ub_document_uuid) }
  it { should validate_presence_of(:user_id) }

  it { should validate_uniqueness_of(:ub_document_uuid, :message => 'already have open transaction') }

  it { should allow_values_for(:uuid, UUID_FORMAT_REGEX)}

  before(:each) do
    @transaction = Factory.create(:ub_sync_transaction)

    # Create a multi-part file
    @file_with_parts = []
    @file_with_parts.instance_eval do
      def path; @path; end
      def path=(path); @path = path; end
      def content_type; @content_type; end
      def content_type=(content_type); @content_type = content_type; end
      def digest; @degest; end
      def digest=(degest); @degest = degest; end
    end

    @file_with_parts.path = 'synctran-acti-onit-em00-0000000000000.txt'
    @file_with_parts.content_type = 'text/plain'
    upload_file_path = fixture_file(@file_with_parts.path)

    @file_with_parts.digest = Digest::MD5.file(upload_file_path).hexdigest

    part_count = 0
    File.open(upload_file_path) do |file|
      while(data = file.read(5)) do
        part_count += 1

        tempfile = Tempfile.new(@file_with_parts.path + ".part#{part_count}")
        tempfile << data
        tempfile.rewind

        @file_with_parts << {
          :path => @file_with_parts.path,
          :content_type => @file_with_parts.content_type,
          :data => tempfile,
          :part_nb => part_count,
          :part_check_sum => Digest::MD5.file(tempfile.path).hexdigest,
          :item_check_sum => @file_with_parts.digest
        }
      end
    end
    @file_with_parts.each {|p| p[:part_total_nb] = part_count}
  end

  it "should be complete" do
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item))

    @transaction.should be_complete
  end

  it "should not be complete without items" do
    @transaction.should_not be_complete
    @transaction.errors.on(:items).should =~ /can't be empty/i
  end

  it "should not be complete with incomplete partial items" do
    path = "synctran-acti-onit-em00-0000000000000.txt"
    content_type = "text/plain"

    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 2,
        :part_total_nb => 3)
    )

    @transaction.should_not be_complete
    @transaction.errors.on(:items).should =~ /item '#{path}' with '3' parts don't have part '3'/
  end

  it "should be complete with complete partial items" do
    path = "synctran-acti-onit-em00-0000000000000.txt"
    content_type = "text/plain"

    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 3,
        :part_total_nb => 3)
    )

    @transaction.should be_complete
  end

  it "should be complete with one part present more one time" do
    path = "synctran-acti-onit-em00-0000000000000.txt"
    content_type = "text/plain"

    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :content_type => content_type,
        :part_nb => 3,
        :part_total_nb => 3)
    )

    @transaction.should be_complete
  end

  it "should return false when commited if incomplete" do
    @transaction.should_receive(:complete?).and_return(false)

    @transaction.commit.should be_false
  end

  it "should have error when commited if multi-part item can't be merged" do
    tempfile = Tempfile.new('fake.part')
    @file_with_parts[1][:data] = tempfile
    @file_with_parts[1][:part_check_sum] = Digest::MD5.file(tempfile.path).hexdigest

    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit
    @transaction.errors.on(:items).should =~ /parts can't be merged/
  end

  it "should not have error when commited if multi-part item can be merged" do
    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit
    @transaction.errors.on(:items).should_not =~ /parts can't be merged/
  end

  it "should not have error when commited if multi-part item have one item more one time" do
    @file_with_parts << @file_with_parts[1]
    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit
    @transaction.errors.on(:items).should_not =~ /parts can't be merged/
  end

  it "should have error when Unibaord Document file is not present" do
    @transaction.should_receive(:complete?).and_return(true)

    @transaction.commit
    @transaction.errors.on(:items).should =~ /Transaction don't have Uniboard Document descrition file/
  end

  it "should be commited with valid document transaction" do
    fixture_ubz(:valid).each do |path|
      @transaction.items.create!(
        :path => path.gsub(/.*?#{UUID_FORMAT_REGEX}\//, ''),
        :content_type => get_content_type_from_filename(path) || "application/octet+stream",
        :data => File.open(path),
        :part_nb => 1,
        :part_total_nb => 1,
        :part_check_sum => Digest::MD5.file(path).hexdigest,
        :item_check_sum => Digest::MD5.file(path).hexdigest,
        :storage_config => {:name => :filesystem}
      )
    end

    @transaction.commit.should be_true
    @transaction.should have(:no).error

    document  = UbDocument.find_by_uuid(@transaction.ub_document_uuid)
    document.should_not be_nil
    document.should have(3).pages
    document.pages.first.media.get_resource(UbMedia::UB_THUMBNAIL_DESKTOP_TYPE).should_not be_nil
  end

  it "should have xml format (with page url)" do
    transaction_xml = REXML::Document.new(@transaction.to_xml)

    transaction_xml.root.name.should == 'transaction'
    transaction_xml.root.attributes.to_hash.should include(
      'xmlns' => 'http://uniboard.mnemis.com/document',
      'uuid' => @transaction.uuid,
      'client_uuid' => @transaction.ub_client_uuid,
      'created-at' => @transaction.created_at.xmlschema,
      'updated-at' => @transaction.updated_at.xmlschema
    )
  end
end
