class AddStorageToUbMedia < ActiveRecord::Migration
  def self.up
        add_column :ub_medias, :storage_config, :string
  end

  def self.down
        remove_column :ub_medias, :storage_config
  end
end
