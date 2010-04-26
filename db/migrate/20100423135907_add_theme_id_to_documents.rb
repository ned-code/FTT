class AddThemeIdToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :theme_id, :integer
    add_index :documents, :theme_id
  end

  def self.down
    remove_index :documents, :theme_id
    remove_column :documents, :theme_id
  end
end
