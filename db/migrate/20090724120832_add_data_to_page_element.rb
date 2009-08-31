class AddDataToPageElement < ActiveRecord::Migration
  def self.up
    add_column :ub_page_elements, :data, :string
  end

  def self.down
    remove_column :ub_page_elements, :data
  end
end
