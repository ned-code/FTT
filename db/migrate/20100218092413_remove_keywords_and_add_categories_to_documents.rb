class RemoveKeywordsAndAddCategoriesToDocuments < ActiveRecord::Migration
  def self.up
    remove_column :documents, :keywords
    add_column    :documents, :category_id, :integer
  end

  def self.down
    add_column    :documents, :keywords
    remove_column :documents, :category
  end
end
