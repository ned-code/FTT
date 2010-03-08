class RenamePublicDocument < ActiveRecord::Migration
  def self.up
    rename_column :documents, :public, :is_public
  end

  def self.down
    rename_column :documents, :is_public, :public
  end
end
