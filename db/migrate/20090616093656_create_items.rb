class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items, :id => false  do |t|
      t.string  :uuid,     :limit => 36,                 :primary => true
      t.string  :page_id,  :limit => 36, :null => false

      t.string  :media_id, :limit => 36
      t.string  :media_type      
      t.text    :data,     :limit => 64.kilobytes + 1
      
      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end