class AddUserIdInDiscussions < ActiveRecord::Migration
  def self.up
    add_column :discussions, :user_id, :string, :limit => 36, :null => false
  end

  def self.down
    remove_column :discussions, :user_id
  end
end
