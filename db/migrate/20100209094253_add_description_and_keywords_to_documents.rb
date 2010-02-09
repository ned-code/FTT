class AddDescriptionAndKeywordsToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :description, :text
    add_column :documents, :keywords, :string
  end

  def self.down
    remove_column :documents, :description
    remove_column :documents, :keywords
  end
end
