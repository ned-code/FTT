class CreateUniboardPages < ActiveRecord::Migration
  def self.up
    create_table :uniboard_pages do |t|
      t.string  :uuid,                  :nil => false
      t.integer :position,              :nil => false
      t.integer :version,               :nil => false, :default => 1

      t.integer :uniboard_document_id,  :nil => false

      t.timestamps
    end
  end

  def self.down
    drop_table :uniboard_pages
  end
end
