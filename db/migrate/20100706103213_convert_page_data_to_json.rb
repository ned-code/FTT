class ConvertPageDataToJson < ActiveRecord::Migration
  def self.up
    Page.all.each do |page|
      page.update_attribute(:data, page.data)
    end    
  end

  def self.down
  end
end
