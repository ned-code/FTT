class AddSizeToDocuments < ActiveRecord::Migration
  def self.up
    add_column    :documents, :size, :text
  end

  def self.down
    remove_column :documents, :size
  end
end
