class CreateDiscussions < ActiveRecord::Migration
  def self.up
    create_table :discussions, :id => false do |t|
      t.string   :uuid, :limit => 36, :null => false
      t.string   :page_id, :limit => 36
      t.datetime :deleted_at
      t.text     :properties
      t.timestamps
    end

    execute 'ALTER TABLE discussions ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table :discussions
  end
end
