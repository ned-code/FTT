class CreateDatastores < ActiveRecord::Migration
  def self.up
    create_table :datastores do |t|
      t.string :ds_key, :null => false
      t.text :ds_value, :null => false, :limit => 64.kilobytes + 1
      t.string :widget_uuid, :limit => 36
      t.string :user_id, :limit => 36

      t.timestamps
    end
  end

  def self.down
    drop_table :datastores
  end
end
