class AddTitleToPage < ActiveRecord::Migration
  def self.up
     add_column :pages, :title, :string,  :default => 'undefined'
  end

  def self.down
    remove_column :pages, :title
  end
end
