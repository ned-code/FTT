class RenameDocumentWithUbPrefix < ActiveRecord::Migration
  def self.up
        rename_table :uniboard_documents, :ub_documents
        execute "UPDATE roles set authorizable_type = 'UbDocument' where authorizable_type = 'UniboardDocument' "
  end

  def self.down
        rename_table :ub_documents, :uniboard_documents
  end
end
