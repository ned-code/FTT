class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.string  :uuid, :null => false
      t.integer :page_id, :null => false
      t.integer :media_id, :null => false
      t.text :data, :limit => 64.kilobytes + 1
      t.string :item_type, :null => false, :default => 'object'
      
      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end