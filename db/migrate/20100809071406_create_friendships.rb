class CreateFriendships < ActiveRecord::Migration
  def self.up
    create_table :friendships, :id => false  do |t|
      t.string :uuid, :primary => true, :limit => 36
      t.string :user_id, :limit => 36
      t.string :friend_id, :limit => 36
      t.string :status
      t.timestamps
    end
    execute 'ALTER TABLE friendships ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table  :friendships
  end
end
