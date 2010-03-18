require 'spec_helper'

describe DatastoreEntry do
  
  should_allow_mass_assignment_of :ds_key, :ds_value
  should_not_allow_mass_assignment_of :id, :user_id, :item_id, :created_at, :updated_at
  
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
      entries = @item.datastore_entries.filter_with(:key => 'vote')
      entries.should == [@datastore_entry1, @datastore_entry3]
    end
    
    it "should find all item's entries from current_user" do
      Thread.current[:user] = @user1
      entries = @item.datastore_entries.filter_with(:only_current_user => 'true')
      entries.should == [@datastore_entry1, @datastore_entry2]
    end
    
    it "should find all item's entries with 'text' key from current_user" do
      Thread.current[:user] = @user1
      entries = @item.datastore_entries.filter_with(:only_current_user => 'true', :key => 'vote')
      entries.should == [@datastore_entry1]
    end
    
  end
  
end

# == Schema Information
#
# Table name: datastore_entries
#
#  id         :integer         not null, primary key
#  ds_key     :string(255)     not null
#  ds_value   :text(65537)     not null
#  user_id    :string(36)
#  created_at :datetime
#  updated_at :datetime
#  item_id    :integer
#

