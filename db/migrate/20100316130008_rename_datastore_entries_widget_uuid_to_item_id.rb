class RenameDatastoreEntriesWidgetUuidToItemId < ActiveRecord::Migration
  def self.up
    add_column :datastore_entries, :item_id, :integer
    
    DatastoreEntry.reset_column_information
    DatastoreEntry.all.each do |entry|
      entry.update_attribute(:item_id, Item.find_by_uuid!(entry.widget_uuid).id)
    end
    
    remove_column :datastore_entries, :widget_uuid
  end
  
  def self.down
    add_column :datastore_entries, :widget_uuid, :text
    
    DatastoreEntry.reset_column_information
    DatastoreEntry.all.each do |entry|
      entry.update_attribute(:widget_uuid, Item.find(entry.item_id).uuid)
    end
    
    remove_column :datastore_entries, :item_id
  end
end
