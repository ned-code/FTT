class CreateUserLists < ActiveRecord::Migration
  def self.up
    create_table :user_lists, :id => false  do |t|
      t.string :uuid, :primary => true, :limit => 36
      t.string :user_id, :limit => 36
      t.boolean :public, :default => false
      t.timestamp
    end
    execute 'ALTER TABLE user_lists ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table  :user_lists
  end
end
