class AddColumnPositionToUniboardDocument < ActiveRecord::Migration
  def self.up
    add_column :uniboard_documents, :version, :integer, :nil => false, :default => 1
  end

  def self.down
    remove_column :uniboard_documents, :version
  end
end
