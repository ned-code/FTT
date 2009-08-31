class AddTypeToPageElement < ActiveRecord::Migration
  def self.up
      add_column :ub_page_elements, :element_type, :string, :nil => false, :default => 'object'
  end

  def self.down
      remove_column :ub_page_elements, :element_type
  end
end
