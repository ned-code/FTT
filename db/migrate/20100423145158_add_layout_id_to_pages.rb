class AddLayoutIdToPages < ActiveRecord::Migration
  def self.up
    add_column :pages, :layout_id, :integer
    add_index :pages, :layout_id
  end

  def self.down
    remove_index :pages, :layout_id
    remove_column :pages, :layout_id
  end
end
