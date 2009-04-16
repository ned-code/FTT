class CreateUniboardDocuments < ActiveRecord::Migration
  def self.up
    create_table :uniboard_documents do |t|
      t.string :uuid,   :nil => false
      t.string :bucket, :nil => false
      t.timestamps
    end
  end

  def self.down
    drop_table :uniboard_documents
  end
end
