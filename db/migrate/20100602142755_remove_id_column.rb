class RemoveIdColumn < ActiveRecord::Migration
  def self.up
    remove_column :categories, :id
    remove_column :datastore_entries, :id
    remove_column :documents, :id
    remove_column :followships, :id
    remove_column :items, :id
    remove_column :layouts, :id
    remove_column :medias, :id
    remove_column :pages, :id
    remove_column :roles, :id
    remove_column :themes, :id
    remove_column :users, :id
    add_column :users, :id, :integer, :default => nil
    remove_column :view_counts, :id
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
