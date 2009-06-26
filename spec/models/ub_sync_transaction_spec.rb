require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbSyncTransaction do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it { should have_many(:items) }

  it { should validate_presence_of(:uuid) }
  it { should validate_presence_of(:ub_client_uuid) }
  it { should validate_presence_of(:ub_document_uuid) }
  it { should validate_presence_of(:user_id) }

  it { should allow_values_for(:uuid, UUID_FORMAT_REGEX)}

  before(:each) do
    @transaction = Factory.create(:ub_sync_transaction)

    # Create a multi-part file
    @file_with_parts = []
    @file_with_parts.instance_eval do
      def path; @path; end
      def path=(path); @path = path; end
      def digest; @degest; end
      def digest=(degest); @degest = degest; end
    end

    @file_with_parts.path = 'sync-transaction-item.txt'
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
    path = "sync-transaction-item.txt"
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 2,
        :part_total_nb => 3)
    )

    @transaction.should_not be_complete
    @transaction.errors.on(:items).should =~ /item '#{path}' with '3' parts don't have part '3'/
  end

  it "should be complete with complete partial items" do
    path = "sync-transaction-item.txt"
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 3,
        :part_total_nb => 3)
    )

    @transaction.should be_complete
  end

  it "should be complete with one part present more one time" do
    path = "sync-transaction-item.txt"
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 1,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 2,
        :part_total_nb => 3)
    )
    @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :path => path,
        :part_nb => 3,
        :part_total_nb => 3)
    )

    @transaction.should be_complete
  end

  it "should be commited" do
    @transaction.should_receive(:complete?).and_return(true)

    lambda { @transaction.commit }.should_not raise_error
  end

  it "should return false when commited if incomplete" do
    @transaction.should_receive(:complete?).and_return(false)

    @transaction.commit.should be_false
  end

  it "should return false when commited if multi-part item can't be merged" do
    tempfile = Tempfile.new('fake.part')
    @file_with_parts[1][:data] = tempfile
    @file_with_parts[1][:part_check_sum] = Digest::MD5.file(tempfile.path).hexdigest

    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit.should be_false
  end

  it "should return true when commited if multi-part item can be merged" do
    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit

    puts @transaction.errors.full_messages

    @transaction.commit.should be_true
  end

  it "should return true when commited if multi-part item have one item more one time" do
    @file_with_parts << @file_with_parts[1]
    @file_with_parts.each do |part|
      @transaction.items.create!(part.merge(:storage_config => {:name => :filesystem}))
    end

    @transaction.commit.should be_true
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
