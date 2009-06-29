class AddContentTypeToTransactionItem < ActiveRecord::Migration
  def self.up
    add_column :ub_sync_transaction_items, :content_type, :string
  end

  def self.down
    remove_column :ub_sync_transaction_items, :content_type
  end
end
