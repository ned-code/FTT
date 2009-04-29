class AddDeletedColumnToDocuments < ActiveRecord::Migration
  def self.up
    add_column :uniboard_documents, :deleted_at, :datetime, :nil => true
  end

  def self.down
    remove_column :uniboard_documents, :deleted_at
  end
end
