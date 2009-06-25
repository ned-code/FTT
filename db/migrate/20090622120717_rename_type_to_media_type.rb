class RenameTypeToMediaType < ActiveRecord::Migration
  def self.up
    rename_column(:ub_medias, :type, :media_type)
    rename_column(:ub_conversions, :type, :media_type)
  end

  def self.down
    rename_column(:ub_medias, :media_type, :type)
    rename_column(:ub_conversions, :media_type, :type)
  end
end
