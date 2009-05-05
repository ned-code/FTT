class AddNameToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :firstname, :string, :nil => false
    add_column :users, :lastname, :string, :nil => false
  end

  def self.down
    remove_column :users, :lastname
    remove_column :users, :firstname
  end
end
