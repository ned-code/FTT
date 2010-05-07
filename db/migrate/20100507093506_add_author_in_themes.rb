class AddAuthorInThemes < ActiveRecord::Migration
  def self.up
    add_column :themes, :author, :string
  end

  def self.down
    remove_column :themes, :author
  end
end
