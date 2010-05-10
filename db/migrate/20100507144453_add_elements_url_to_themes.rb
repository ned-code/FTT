class AddElementsUrlToThemes < ActiveRecord::Migration
  def self.up
    add_column :themes, :elements_url, :string
  end

  def self.down
    remove_column :themes, :elements_url
  end
end
