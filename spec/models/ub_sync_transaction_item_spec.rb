require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbSyncTransactionItem do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it { should belong_to(:transaction) }

  it { should validate_presence_of(:ub_sync_transaction_id) }
  it { should validate_presence_of(:path) }
  it { should validate_presence_of(:part_nb) }
  it { should validate_presence_of(:part_total_nb) }
  it { should validate_presence_of(:part_hash_control) }
  it { should validate_presence_of(:item_hash_control) }

  before(:each) do
    @transaction = Factory.create(:ub_sync_transaction)
  end

  it "should valid if hash control not match with file" do
    upload_file_path = fixture_file('sync-transaction-item.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_hash_control => uploaded_file_digest)
    )
    item.should be_valid

    item.reload
    item.data.should be_kind_of(Tempfile)
  end

  it "should not valid if hash control not match with file" do
    upload_file_path = fixture_file('sync-transaction-item.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_hash_control => 'fake')
    )
    item.should_not be_valid
    item.should have(1).error_on(:part_hash_control)
  end

  it "should retrive data" do
    upload_file_path = fixture_file('sync-transaction-item.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_hash_control => uploaded_file_digest)
    )

    item.reload
    uploaded_file.rewind # re-read in following test
    
    item.data.should be_kind_of(Tempfile)
    item.data.read.should == uploaded_file.read
  end
end
