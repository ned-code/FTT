class AddUpdatedThemeIdToTheme < ActiveRecord::Migration
  def self.up
    add_column :themes, :updated_theme_id, :integer
    add_index :themes, :updated_theme_id
  end

  def self.down
    remove_index :themes, :updated_theme_id
    remove_column :themes, :updated_theme_id
  end
end
