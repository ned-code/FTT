class SwitchMediasFromPaperclipToCarrierwave < ActiveRecord::Migration
  def self.up
    remove_column :medias, :file_file_name
    remove_column :medias, :file_content_type
    remove_column :medias, :file_file_size
    remove_column :medias, :file_updated_at
    
    add_column :medias, :file, :string
  end
  
  def self.down
    add_column :medias, :file_file_name, :string
    add_column :medias, :file_content_type, :string
    add_column :medias, :file_file_size, :integer
    add_column :medias, :file_updated_at, :datetime
    
    remove_column :medias, :file
  end
end