class AddShapeId < ActiveRecord::Migration
  def self.up
    add_column :items, :shape_id, :string, :limit => 36
  end

  def self.down
    remove_column :items, :shape_id    
  end
end
