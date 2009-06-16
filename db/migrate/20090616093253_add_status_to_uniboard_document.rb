class AddStatusToUniboardDocument < ActiveRecord::Migration
  def self.up
    add_column :uniboard_documents, :status, :integer
  end

  def self.down
    remove_column :uniboard_documents, :status
  end
end
