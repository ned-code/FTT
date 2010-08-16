class RemoveIsPublicFromDocument < ActiveRecord::Migration
  def self.up
    remove_column :documents, :is_public
  end

  def self.down
    add_column :documents, :is_public, :boolean, :default => false
  end
end
