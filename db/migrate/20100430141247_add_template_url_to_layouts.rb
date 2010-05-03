class AddTemplateUrlToLayouts < ActiveRecord::Migration
  def self.up
    add_column :layouts, :template_url, :string
  end

  def self.down
    remove_column :layouts, :template_url
  end
end
