class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.string   :uuid, :limit => 36
      
      t.string   :title
      t.datetime :deleted_at
      
      t.timestamps
    end
  end
  
  def self.down
    drop_table :documents
  end
end
