class AddFontsUrlToTheme < ActiveRecord::Migration
  def self.up
    add_column :themes, :fonts_url, :string
  end

  def self.down
    remove_column :themes, :fonts_url
  end
end
