class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments, :id => false do |t|
      t.string   :uuid, :limit => 36, :null => false
      t.integer  :discussion_id
      t.integer  :user_id
      t.text     :content
      t.datetime :deleted_at
      t.boolean  :root
      t.timestamps
    end

    execute 'ALTER TABLE comments ADD PRIMARY KEY (uuid);' 
  end

  def self.down
    drop_table :comments
  end
end
