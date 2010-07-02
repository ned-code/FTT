require 'spec_helper'

describe DatastoreEntry do
    
  describe "all_with_filter method" do
    
    before(:each) do
      Factory(:theme_without_upload)
      @item = Factory(:item)
      @user1 = Factory(:user)
      @user2 = Factory(:user)
      @datastore_entry_private_1 = Factory(:datastore_entry, :item => @item, :user => @user1, :ds_key => 'vote', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_PRIVATE)
      @datastore_entry_private_2 = Factory(:datastore_entry, :item => @item, :user => @user1, :ds_key => 'text', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_PRIVATE)
      @datastore_entry_public_read_1 = Factory(:datastore_entry, :item => @item, :user => @user2, :ds_key => 'vote', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_READ)
      @datastore_entry_public_read_2 = Factory(:datastore_entry, :item => @item, :user => @user2, :ds_key => 'text', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_READ)
      @datastore_entry_public_read_write_1 = Factory(:datastore_entry, :item => @item, :user => @user2, :ds_key => 'vote', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_READ_WRITE)
      @datastore_entry_public_read_write_2 = Factory(:datastore_entry, :item => @item, :user => @user2, :ds_key => 'text', :protection_level => DatastoreEntry::CONST_PROTECTION_LEVEL_READ_WRITE)
    end

    context "anonymous user" do
    
      it "should find all public item's entries with 'vote' key" do
        entries = @item.datastore_entries.filter_with(nil, { :key => 'vote'})
        entries.length.should == 2
        entries.should include @datastore_entry_public_read_write_1
        entries.should include @datastore_entry_public_read_1
      end

      it "should return no entries when :only_current_user is set to true" do
        entries = @item.datastore_entries.filter_with(nil, { :only_current_user => 'true' })
        entries.length.should == 0
      end

    end

    context "logged user" do

      it "should find own and all public item's entries with 'vote' key" do
        entries = @item.datastore_entries.filter_with(@user1, { :key => 'vote' })
        entries.length.should == 3
        entries.should include @datastore_entry_private_1
        entries.should include @datastore_entry_public_read_1
        entries.should include @datastore_entry_public_read_write_1
      end

      it "should find all item's entries from current_user" do
        entries = @item.datastore_entries.filter_with(@user1, { :only_current_user => 'true' })
        entries.length.should == 2
        entries.should include @datastore_entry_private_1
        entries.should include @datastore_entry_private_2
      end

      it "should find all item's entries with 'text' key from current_user" do
        entries = @item.datastore_entries.filter_with(@user1, { :only_current_user => 'true', :key => 'vote'})
        entries.length.should == 1
        entries.should include @datastore_entry_private_1
      end

    end
    
  end
  
end




# == Schema Information
#
# Table name: datastore_entries
#
#  ds_key           :string(255)     not null
#  ds_value         :text(16777215)  default(""), not null
#  user_id          :string(36)
#  created_at       :datetime
#  updated_at       :datetime
#  item_id          :string(36)
#  uuid             :string(36)      default(""), not null, primary key
#  protection_level :integer(4)      default(0), not null
#

