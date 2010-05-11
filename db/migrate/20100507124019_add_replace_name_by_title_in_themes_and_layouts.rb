class AddReplaceNameByTitleInThemesAndLayouts < ActiveRecord::Migration
  def self.up
    rename_column :themes, :name, :title
    rename_column :layouts, :name, :title
  end

  def self.down
    rename_column :themes, :title, :name
    rename_column :layouts, :title, :name
  end
end
