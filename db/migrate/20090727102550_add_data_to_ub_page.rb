class AddDataToUbPage < ActiveRecord::Migration
  def self.up
        add_column :ub_pages, :data, :string
  end

  def self.down
        remove_column :ub_pages, :data
  end
end
