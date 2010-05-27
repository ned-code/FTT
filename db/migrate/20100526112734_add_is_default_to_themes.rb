class AddIsDefaultToThemes < ActiveRecord::Migration
  def self.up
    add_column :themes, :is_default, :bool, :default => false
  end

  def self.down
    remove_column :themes, :is_default
  end
end
