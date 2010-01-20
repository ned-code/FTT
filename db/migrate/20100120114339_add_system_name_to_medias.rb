class AddSystemNameToMedias < ActiveRecord::Migration
  def self.up
    add_column :medias, :system_name, :string
    add_index :medias, :system_name
  end
  
  def self.down
    remove_column :medias, :system_name
    remove_index :medias, :system_name
  end
end
