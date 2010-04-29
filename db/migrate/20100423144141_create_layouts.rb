class CreateLayouts < ActiveRecord::Migration
  def self.up
    create_table :layouts do |t|
      t.string :uuid
      t.string :name
      t.string :thumbnail_url
      t.integer :theme_id
      t.integer :model_page_id
    end
    add_index :layouts, :uuid
    add_index :layouts, :theme_id
    add_index :layouts, :model_page_id
  end
  
  def self.down
    remove_index :layouts, :model_page_id
    remove_index :layouts, :theme_id
    remove_index :layouts, :uuid
    drop_table :layouts
  end
end
