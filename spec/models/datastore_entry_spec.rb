require 'spec_helper'

describe DatastoreEntry do
    
  describe "all_with_filter method" do
    
    before(:each) do
      @item = Factory(:item)
      @user1 = Factory(:user)
      @user2 = Factory(:user)
      @datastore_entry1 = Factory(:datastore_entry, :item => @item, :user => @user1, :ds_key => 'vote')
      @datastore_entry2 = Factory(:datastore_entry, :item => @item, :user => @user1, :ds_key => 'text')
      @datastore_entry3 = Factory(:datastore_entry, :item => @item, :user => @user2, :ds_key => 'vote')
    end
    
    it "should find all item's entries with 'vote' key" do
      entries = @item.datastore_entries.filter_with(@user1, { :key => 'vote'})
      entries.should == [@datastore_entry1, @datastore_entry3]
    end
    
    it "should find all item's entries from current_user" do
      entries = @item.datastore_entries.filter_with(@user1, { :only_current_user => 'true' })
      entries.should == [@datastore_entry1, @datastore_entry2]
    end
    
    it "should find all item's entries with 'text' key from current_user" do
      entries = @item.datastore_entries.filter_with(@user1, { :only_current_user => 'true', :key => 'vote'})
      entries.should == [@datastore_entry1]
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

