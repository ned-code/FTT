class CarrierwaveToPaperclip < ActiveRecord::Migration
  def self.up
    rename_column :medias, :file,                    :attachment_file_name
    add_column    :medias, :attachment_content_type, :string
    add_column    :medias, :attachment_file_size,    :integer
    add_column    :medias, :attachment_updated_at,   :datetime

    rename_column :users,  :avatar,                  :avatar_file_name
    add_column    :users,  :avatar_content_type,     :string
    add_column    :users,  :avatar_file_size,        :integer
    add_column    :users,  :avatar_updated_at,       :datetime
    
    rename_column :themes, :file,                    :attachment_file_name
    add_column    :themes, :attachment_content_type, :string
    add_column    :themes, :attachment_file_size,    :integer
    add_column    :themes, :attachment_updated_at,   :datetime
  end

  def self.down
    rename_column :medias, :attachment_file_name, :file
    remove_column :medias, :attachment_content_type
    remove_column :medias, :attachment_file_size
    remove_column :medias, :attachment_updated_at

    rename_column :users,  :avatar_file_name, :file
    remove_column :users,  :avatar_content_type
    remove_column :users,  :avatar_file_size
    remove_column :users,  :avatar_updated_at

    rename_column :themes, :attachment_file_name, :file
    remove_column :themes, :attachment_content_type
    remove_column :themes, :attachment_file_size
    remove_column :themes, :attachment_updated_at
  end
end
