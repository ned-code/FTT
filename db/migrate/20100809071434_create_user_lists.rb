class CreateUserLists < ActiveRecord::Migration
  def self.up
    create_table :user_lists, :id => false  do |t|
      t.string :uuid, :limit => 36
      t.string :user_id, :limit => 36
      t.boolean :public, :default => false
      t.boolean :default, :default => false
      t.string :name
      t.timestamp
    end
    execute 'ALTER TABLE user_lists ADD PRIMARY KEY (uuid);'
    
    #Create a default list for each user in the DB
    User.all.each do |u|
      UserList.create!({ :default => true, :user_id => u.uuid, :name => 'All' })
    end
  end

  def self.down
    drop_table  :user_lists
  end
end
