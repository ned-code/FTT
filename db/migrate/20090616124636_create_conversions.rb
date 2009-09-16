class CreateConversions < ActiveRecord::Migration
  def self.up
    create_table :conversions do |t|
      t.string :path,      :null => false
      t.string :mime_type, :null => false
      t.string :parameters
      t.string :media_id,  :limit => 36, :null => false
      
      t.timestamps
    end
  end

  def self.down
    drop_table :conversions
  end
end
