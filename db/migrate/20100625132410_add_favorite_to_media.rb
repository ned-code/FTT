class AddFavoriteToMedia < ActiveRecord::Migration
  def self.up
    add_column :medias, :favorites, :boolean, :default => false
  end

  def self.down
    remove_column :medias, :favorites
  end
end
