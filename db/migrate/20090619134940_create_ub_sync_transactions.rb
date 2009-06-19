class CreateUbSyncTransactions < ActiveRecord::Migration
  def self.up
    create_table :ub_sync_transactions do |t|
      t.string  :transaction_uuid,  :null => false
      t.string  :ub_client_uuid,    :null => false
      t.string  :ub_document_uuid,  :null => false
      t.integer :user_id,           :null => false
      t.timestamps
    end

    create_table :ub_sync_transaction_items do |t|
      t.integer :ub_sync_transaction_id,  :null => false
      t.string  :path,                    :null => false
      t.string  :storage_config,          :null => false
      t.integer :part_nb,                 :null => false
      t.integer :part_total_nb,           :null => false
      t.string  :part_hash_control,       :null => false
      t.string  :item_hash_control,       :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :ub_sync_transactions
    drop_table :ub_sync_transaction_items
  end
end
