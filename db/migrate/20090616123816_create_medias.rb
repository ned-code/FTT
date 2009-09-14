class CreateMedias < ActiveRecord::Migration
  def self.up
    create_table :medias do |t|
      t.string :uuid,  :null => false
      t.string :path,  :null => false
      t.string :mime_type,  :null => false
      t.integer :version,  :null => false
      t.string :storage_config
      
      t.timestamps
    end
  end

  def self.down
    drop_table :medias
  end
end
