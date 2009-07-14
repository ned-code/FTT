class AddIsPublicToUbDocuments < ActiveRecord::Migration
  def self.up
    add_column :ub_documents, :is_public, :boolean
    execute "UPDATE ub_documents set is_public = 0 "
  end

  def self.down
    remove_column :ub_documents, :is_public
  end
end
