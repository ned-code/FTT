class CreateUserListsFriends < ActiveRecord::Migration
  def self.up
    create_table :user_lists_friends, :id => false do |t|
      t.string :uuid, :limit => 36
      t.string :user_list_id, :limit => 36
      t.string :friendship_id, :limit => 36
    end
    
    execute 'ALTER TABLE user_lists_friends ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table  :user_lists_friends
  end
end
