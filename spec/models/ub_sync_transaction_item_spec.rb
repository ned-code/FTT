# == Schema Information
#
# Table name: ub_sync_transaction_items
#
#  id                     :integer         not null, primary key
#  ub_sync_transaction_id :integer         not null
#  path                   :string(255)     not null
#  storage_config         :string(255)     not null
#  part_nb                :integer         not null
#  part_total_nb          :integer         not null
#  part_check_sum         :string(255)     not null
#  item_check_sum         :string(255)     not null
#  created_at             :datetime
#  updated_at             :datetime
#  content_type           :string(255)
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbSyncTransactionItem do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it { should belong_to(:transaction) }

  it { should validate_presence_of(:path) }
  it { should validate_presence_of(:content_type) }
  it { should validate_presence_of(:part_nb) }
  it { should validate_presence_of(:part_total_nb) }
  it { should validate_presence_of(:part_check_sum) }
  it { should validate_presence_of(:item_check_sum) }

  before(:each) do
    @transaction = Factory.create(:ub_sync_transaction)
  end

  it "should valid if hash control not match with file" do
    upload_file_path = fixture_file('synctran-acti-onit-em00-0000000000000.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_check_sum => uploaded_file_digest)
    )
    item.should be_valid

    item.reload
    item.data.should be_kind_of(Tempfile)
  end

  it "should not valid if hash control not match with file" do
    upload_file_path = fixture_file('synctran-acti-onit-em00-0000000000000.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_check_sum => 'fake')
    )
    item.should_not be_valid
    item.should have(1).error_on(:part_check_sum)
  end

  it "should retrive data" do
    upload_file_path = fixture_file('synctran-acti-onit-em00-0000000000000.txt')
    uploaded_file = ActionController::TestUploadedFile.new(upload_file_path)
    uploaded_file_digest = Digest::MD5.file(upload_file_path).hexdigest

    item = @transaction.items.create(Factory.attributes_for(:ub_sync_transaction_item,
        :data => uploaded_file, :part_check_sum => uploaded_file_digest)
    )

    item.reload
    original_file = File.open(upload_file_path, 'rb')

    item.data.should be_kind_of(Tempfile)
    item.data.read.should == original_file.read
    original_file.close
  end
end
