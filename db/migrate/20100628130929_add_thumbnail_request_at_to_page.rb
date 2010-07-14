class AddThumbnailRequestAtToPage < ActiveRecord::Migration
  def self.up
    add_column :pages, :thumbnail_request_at, :datetime
  end

  def self.down
    remove_column :pages, :thumbnail_request_at
  end
end
