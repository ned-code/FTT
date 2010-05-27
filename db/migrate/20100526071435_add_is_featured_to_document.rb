class AddIsFeaturedToDocument < ActiveRecord::Migration
  def self.up
    add_column :documents, :featured, :integer, :default => 0
  end
  
  def self.down
    remove_column :documents, :featured
  end
end
