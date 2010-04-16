class AddMissingIndexes < ActiveRecord::Migration
  def self.up
    add_index :documents, :category_id
    add_index :documents, :is_public
    add_index :datastore_entries, :item_id
    add_index :datastore_entries, :user_id
    add_index :documents, :uuid
    add_index :documents, :creator_id
    add_index :followships, :follower_id
    add_index :followships, :following_id
    add_index :items, :uuid
    add_index :medias, :uuid
    add_index :pages, :uuid
    add_index :view_counts, :session_id
  end

  def self.down
    remove_index :documents, :category_id
    remove_index :documents, :is_public
    remove_index :datastore_entries, :item_id
    remove_index :datastore_entries, :user_id
    remove_index :documents, :uuid
    remove_index :documents, :creator_id
    remove_index :followships, :follower_id
    remove_index :followships, :following_id
    remove_index :items, :uuid
    remove_index :medias, :uuid
    remove_index :pages, :uuid
    remove_index :view_counts, :session_id    
  end
end
