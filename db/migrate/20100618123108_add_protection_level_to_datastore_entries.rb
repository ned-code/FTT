class AddProtectionLevelToDatastoreEntries < ActiveRecord::Migration
  def self.up
      add_column :datastore_entries, :protection_level, :integer, {:default=>0, :null=>false}
    end

  def self.down
      remove_column :datastore_entries, :protection_level
  end
end
