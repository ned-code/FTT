class CreateAppPolls < ActiveRecord::Migration
  def self.up
    create_table :app_polls, :id => false do |t|
      t.string   :uuid, :limit => 36, :null => false
      t.string   :user_id, :limit => 36
      t.string   :item_id, :limit => 36
      t.string :choices
      t.text :other
      t.string :geolocation
      t.timestamps
    end
    
    execute 'ALTER TABLE app_polls ADD PRIMARY KEY (uuid);'

    #add_index :app_polls, ["item_id"], :name => "index_app_polls_on_item_id"
    #add_index :app_polls, ["user_id"], :name => "index_app_polls_on_user_id"
  end
  
  def self.down
    drop_table :app_polls
  end
end
