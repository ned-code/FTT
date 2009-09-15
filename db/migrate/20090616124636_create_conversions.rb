class CreateConversions < ActiveRecord::Migration
  def self.up
    create_table :conversions do |t|
      t.string :path,  :null => false
      t.string :mime_type,  :null => false
      t.string :parameters
      t.integer :media_id, :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :conversions
  end
end
