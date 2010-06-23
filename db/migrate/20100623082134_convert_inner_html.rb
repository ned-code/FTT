class ConvertInnerHtml < ActiveRecord::Migration
  def self.up
    Item.all.each do |item|
      if (item.data[:innerHTML])                
        item.inner_html = item.data[:innerHTML]
        item.data.delete(:innerHTML)
        item.touch_page_active = false
        item.save
      elsif (item.data[:innerHtml])
        item.inner_html = item.data[:innerHtml]
        item.data.delete(:innerHtml)
        item.touch_page_active = false
        item.save
      end
    end    
  end

  def self.down
  end
end
