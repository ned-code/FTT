class RemoveWebdocFromItems < ActiveRecord::Migration
  def self.up
    Item.all.each do |item|
      if item.data && item.data[:class]
        item.data[:class].gsub! "webdoc", ""
        item.touch_page_active = false
        item.save(false)
      end
    end
  end

  def self.down
  end
end
