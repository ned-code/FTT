class AddIndexToFk < ActiveRecord::Migration
  def self.up
    add_index :pages, :document_id
    add_index :items, :page_id
  end

  def self.down
    remove_index :pages, :document_id
    remove_index :items, :page_id
   
  end
end
