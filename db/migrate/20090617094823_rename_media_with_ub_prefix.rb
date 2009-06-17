class RenameMediaWithUbPrefix < ActiveRecord::Migration
  def self.up
    rename_table :medias, :ub_medias
    rename_table :page_elements, :ub_page_elements
    rename_table :conversions, :ub_conversions
  end

  def self.down
    rename_table :ub_medias, :medias
    rename_table :ub_page_elements, :page_elements
    rename_table :ub_conversions, :conversions
  end
end
