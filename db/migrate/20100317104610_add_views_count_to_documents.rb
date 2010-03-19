class AddViewsCountToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :views_count, :integer, :default => 0
  end
  
  def self.down
    remove_column :documents, :views_count
  end
end
