class ConvertInnerHtml < ActiveRecord::Migration
  def self.up
    Item.all.each do |item|
      if (item.data && item.data['innerHTML'])                
        item.inner_html = item.data['innerHTML']
        new_data = Hash.new.merge(item.data)        
        new_data.delete('innerHTML')
        item.touch_page_active = false
        item.data = new_data
        item.save
      elsif (item.data && item.data['innerHtml'])
        item.inner_html = item.data['innerHtml']
        new_data = Hash.new.merge(item.data)        
        new_data.delete('innerHtml')
        item.touch_page_active = false
        item.data = new_data
        item.touch_page_active = false
        item.save
      end
    end    
  end

  def self.down
  end
end
