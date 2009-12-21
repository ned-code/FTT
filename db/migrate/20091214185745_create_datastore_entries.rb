class CreateDatastoreEntries < ActiveRecord::Migration
  def self.up
    create_table :datastore_entries do |t|
      t.string  :ds_key, :null => false
      t.text    :ds_value, :null => false, :limit => 64.kilobytes + 1
      t.integer :widget_id
      t.string  :user_id, :limit => 36
      t.timestamps
    end
  end
  
  def self.down
    drop_table :datastore_entries
  end
end
