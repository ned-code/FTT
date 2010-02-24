class AddMetadataToUsers < ActiveRecord::Migration
  def self.up
    rename_column :users, :name, :username
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :avatar, :string
    add_column :users, :bio, :text
    add_column :users, :gender, :string
    add_column :users, :website, :string
    
    add_index :users, :username
  end
  
  def self.down
    rename_column :users, :username, :name
    remove_column :users, :first_name
    remove_column :users, :last_name
    remove_column :users, :username
    remove_column :users, :avatar
    remove_column :users, :bio
    remove_column :users, :gender
    remove_column :users, :website
    
    remove_index :users, :username
  end
end
