class CreatePages < ActiveRecord::Migration
  def self.up
    create_table :pages, :id => false  do |t|
      t.string  :uuid,         :limit => 36,                 :primary => true
      t.string  :document_id,  :limit => 36, :null => false
      t.string  :thumbnail_id, :limit => 36

      t.integer :position,                   :null => false
      t.integer :version,                    :null => false, :default => 1
      t.text    :data,         :limit => 64.kilobytes + 1

      t.timestamps
    end
  end

  def self.down
    drop_table :pages
  end
end
