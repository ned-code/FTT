class AddUuidUnique < ActiveRecord::Migration
  def self.up
    duplicate_uuid = Item.find_by_sql "select * from items group by uuid having (count(uuid) > 1)"
    duplicate_uuid.each do |item_uuid|
      duplicat_items = Item.find_all_by_uuid(item_uuid.uuid)
      duplicat_items.each do |item|
        item.uuid = UUID::generate
        item.save!
      end
    end
    add_index(:items, :uuid, :unique => true, :name => "index_items_unique_uuid")
  end

  def self.down
    remove_index :items, :uuid 
  end
end
