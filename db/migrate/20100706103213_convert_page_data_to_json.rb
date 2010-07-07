class ConvertPageDataToJson < ActiveRecord::Migration
  def self.up
    Page.all.each do |page|
      unless (page.data.nil?)
        begin
          page.update_attribute(:data, page.data)
        rescue => e
          p "error #{e}"
        end      
      end
    end    
  end

  def self.down
  end
end
