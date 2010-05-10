class AddKindInLayoutsPagesItems < ActiveRecord::Migration
  def self.up
    rename_column :layouts, :system_name, :kind
    rename_column :pages, :layout_system_name, :layout_kind
    add_column :items, :kind, :string
  end

  def self.down
    remove_column :items, :kind
    rename_column :pages, :layout_kind, :layout_system_name
    rename_column :layouts, :kind, :system_name
  end
end
