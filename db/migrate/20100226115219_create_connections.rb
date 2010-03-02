class CreateConnections < ActiveRecord::Migration
  def self.up
    create_table :connections do |t|
      t.integer :follower_id, :null => false
      t.integer :following_id, :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :connections
  end
end
