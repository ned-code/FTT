class AddSystemNameToLayouts < ActiveRecord::Migration
  def self.up
    add_column :layouts, :system_name, :string
    add_column :pages, :layout_system_name, :string
    remove_column :pages, :layout_id
  end

  def self.down
    add_column :pages, :layout_id, :integer
    remove_column :pages, :layout_system_name
    remove_column :layouts, :system_name
  end
end
