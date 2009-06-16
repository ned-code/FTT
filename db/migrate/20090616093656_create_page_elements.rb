class CreatePageElements < ActiveRecord::Migration
  def self.up
    create_table :page_elements do |t|
      t.integer :uniboard_page_id,  :nil => false
      t.integer :media_id,  :nil => false
      t.timestamps
    end
  end

  def self.down
    drop_table :page_elements
  end
end
