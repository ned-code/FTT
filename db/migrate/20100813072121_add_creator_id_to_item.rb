class AddCreatorIdToItem < ActiveRecord::Migration
  def self.up
    add_column :items, :creator_id, :string, :limit => 36
    
    #set the right to the creator of the document to all item !
    Item.all.each do |item|
      if item.page && item.page.document
        item.update_attribute('creator_id',item.page.document.creator_id)
      else
        item.destroy
      end
      
    end
  end

  def self.down
    remove_column :items, :creator_id
  end
end
