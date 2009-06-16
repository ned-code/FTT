class CreateConversions < ActiveRecord::Migration
  def self.up
    create_table :conversions do |t|
      t.string :path,  :nil => false
      t.string :type,  :nil => false
      t.string :parameters,  :nil => true
      t.integer :media_id, :nil => false
      t.timestamps
    end
  end

  def self.down
    drop_table :conversions
  end
end
