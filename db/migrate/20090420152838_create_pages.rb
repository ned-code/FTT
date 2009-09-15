class CreatePages < ActiveRecord::Migration
  def self.up
    create_table :pages do |t|
      t.string  :uuid,        :null => false
      t.integer :position,    :null => false
      t.integer :version,     :null => false, :default => 1
      t.integer :document_id, :null => false
      t.integer :thumbnail_id

      t.text :data, :limit => 64.kilobytes + 1

      t.timestamps
    end
  end

  def self.down
    drop_table :pages
  end
end
