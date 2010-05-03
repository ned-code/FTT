class RemoveWebdocFromItems < ActiveRecord::Migration
  def self.up
    Item.all.each do |item|
      if item.data && item.data[:class]
        item.data[:class].gsub! "webdoc", ""
        item.save!
      end
    end
  end

  def self.down
  end
end
