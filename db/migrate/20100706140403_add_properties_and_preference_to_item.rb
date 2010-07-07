class AddPropertiesAndPreferenceToItem < ActiveRecord::Migration
  def self.up
    add_column :items, :properties, :text
    add_column :items, :preferences, :text    
  end

  def self.down
    remove_column :items, :properties
    remove_column :items, :preferences    
  end
end
