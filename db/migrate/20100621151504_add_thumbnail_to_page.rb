class AddThumbnailToPage < ActiveRecord::Migration
  def self.up
    add_column :pages, :thumbnail_file_name,    :string
    add_column :pages, :thumbnail_need_update,  :boolean
    add_column :pages, :thumbnail_secure_token, :string, :limit => 36
  end

  def self.down
    remove_column :pages, :thumbnail_secure_token
    remove_column :pages, :thumbnail_need_update
    remove_column :pages, :thumbnail_file_name
  end
end
