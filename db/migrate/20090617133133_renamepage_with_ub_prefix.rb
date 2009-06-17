class RenamepageWithUbPrefix < ActiveRecord::Migration
  def self.up
      rename_table :uniboard_pages, :ub_pages
  end

  def self.down
    rename_table :ub_pages, :uniboard_pages
  end
end
