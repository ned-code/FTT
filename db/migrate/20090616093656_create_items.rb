class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.string  :uuid,     :limit => 36
      t.integer :page_id, :null => false
      
      t.integer :media_id
      t.string  :media_type      
      t.text    :data,     :limit => 64.kilobytes + 1
      
      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end