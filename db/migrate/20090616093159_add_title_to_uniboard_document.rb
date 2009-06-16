class AddTitleToUniboardDocument < ActiveRecord::Migration
  def self.up
    add_column :uniboard_documents, :title, :string
  end

  def self.down
    remove_column :uniboard_documents, :title
  end
end
