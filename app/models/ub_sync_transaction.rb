class UbSyncTransaction < ActiveRecord::Base
  has_many :items, :class_name => 'UbSyncTransactionItem', :foreign_key => 'ub_sync_transaction_id'
end
