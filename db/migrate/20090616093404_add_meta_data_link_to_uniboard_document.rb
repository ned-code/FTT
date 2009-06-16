class AddMetaDataLinkToUniboardDocument < ActiveRecord::Migration
  def self.up
    add_column :uniboard_documents, :metadata_media_id, :integer
  end

  def self.down
    remove_column :uniboard_documents, :metadata_media_id
  end
end
