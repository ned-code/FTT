class CreateMedias < ActiveRecord::Migration
  def self.up
    create_table :medias, :id => false  do |t|
      t.string   :uuid,       :limit => 36, :primary => true
      t.string   :type
      
      # paperclip fields
      t.string   :file_file_name
      t.string   :file_content_type
      t.integer  :file_file_size
      t.datetime :file_updated_at
      
      t.timestamps
    end
  end

  def self.down
    drop_table :medias
  end
end
