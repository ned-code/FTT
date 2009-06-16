class CreateMedias < ActiveRecord::Migration
  def self.up
    create_table :medias do |t|
      t.string :uuid,  :nil => false
      t.string :path,  :nil => false
      t.string :type,  :nil => false
      t.integer :version,  :nil => false
      t.integer :page_element_id, :nil => true
      t.timestamps
    end
  end

  def self.down
    drop_table :medias
  end
end
