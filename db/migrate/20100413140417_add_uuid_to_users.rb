class AddUuidToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :uuid, :string
    add_index :users, :uuid
  end

  def self.down
    remove_column :users, :uuid
    remove_index :users, :uuid
  end
end
