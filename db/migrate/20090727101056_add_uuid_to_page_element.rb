class AddUuidToPageElement < ActiveRecord::Migration
  def self.up
        add_column :ub_page_elements, :uuid, :string
  end

  def self.down
        remove_column :ub_page_elements, :uuid
  end
end
