class CreateFollowships < ActiveRecord::Migration
  def self.up
    create_table :followships do |t|
      t.integer :follower_id, :null => false
      t.integer :following_id, :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :followships
  end
end