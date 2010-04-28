class CreateThemes < ActiveRecord::Migration
  def self.up
    create_table :themes do |t|
      t.string :uuid
      t.string :name
      t.string :thumbnail_url
      t.string :style_url
      t.string :file
      t.string :version
    end
    add_index :themes, :uuid
  end
  
  def self.down
    remove_index :themes, :uuid
    drop_table :themes
  end
end
