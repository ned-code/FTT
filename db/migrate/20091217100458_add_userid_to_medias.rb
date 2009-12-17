class AddUseridToMedias < ActiveRecord::Migration
  def self.up
    add_column :medias, :user_id, :integer
    add_index :medias, :user_id
  end
  
  def self.down
    remove_column :medias, :user_id
    remove_index :medias, :user_id
  end
end