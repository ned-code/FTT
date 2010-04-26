class CreateLayouts < ActiveRecord::Migration
  def self.up
    create_table :layouts do |t|
      t.string :name
      t.string :thumbnail
      t.integer :theme_id
    end
  end
  
  def self.down
    drop_table :layouts
  end
end
