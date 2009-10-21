class AddPropertiesToMedias < ActiveRecord::Migration
  def self.up
    add_column :medias, :properties, :text, :limit => 64.kilobytes + 1
  end
  
  def self.down
    remove_column :medias, :properties
  end
  
end
