class TakeOutInnerHtml < ActiveRecord::Migration
  def self.up
    add_column :items, :inner_html, :text, {:limit => 64.kilobytes + 1}
  end

  def self.down
    removeColumn :items, inner_html
  end
end
