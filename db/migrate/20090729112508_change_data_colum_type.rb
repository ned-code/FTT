class ChangeDataColumType < ActiveRecord::Migration
  def self.up
    change_column :ub_pages, :data, :text, :limit => 64.kilobytes + 1
    change_column :ub_page_elements, :data, :text, :limit => 64.kilobytes + 1
  end

  def self.down
    change_column :ub_pages, :data, :string
    change_column :ub_page_elements, :data, :string
  end
end
