class UbSyncTransactionItem < ActiveRecord::Base
  belongs_to :transaction, :class_name => 'UbSyncTransaction', :foreign_key => 'ub_sync_transaction_id'
end
