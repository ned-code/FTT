class AddThemeIdAndStyleUrlToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :theme_id, :integer
    add_column :documents, :style_url, :string
    add_index :documents, :theme_id
  end

  def self.down
    remove_index :documents, :theme_id
    remove_column :documents, :style_url
    remove_column :documents, :theme_id
  end
end
