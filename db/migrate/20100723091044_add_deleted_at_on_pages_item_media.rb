class AddDeletedAtOnPagesItemMedia < ActiveRecord::Migration
  def self.up
    add_column :pages, :deleted_at, :datetime
    add_column :items, :deleted_at, :datetime
    add_column :medias, :deleted_at, :datetime
  end

  def self.down
    remove_column :medias, :deleted_at
    remove_column :items, :deleted_at
    remove_column :pages, :deleted_at
  end
end
