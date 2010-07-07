class MigrateDataToJson < ActiveRecord::Migration
  def self.up
    Item.reset_column_information
    Item.all.each do |item|
      unless (item.page.nil?)
        properties = item.data['properties']
        if (properties.nil?)
          properties = {}
        end
        item.update_attribute(:properties, properties)
        item.data.delete('properties')
        preferences = item.data['preference']
        item.update_attribute(:preferences, preferences)
        item.data.delete('preference')      
        item.update_attribute(:data, item.data)
      end
    end    
  end

  def self.down
  end
end
