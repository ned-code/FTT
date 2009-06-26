Factory.define :ub_sync_transaction do |ub_sync_transaction|
  ub_sync_transaction.uuid              {|a| UUID.generate }
  ub_sync_transaction.ub_client_uuid    {|a| UUID.generate }
  ub_sync_transaction.ub_document_uuid  {|a| UUID.generate }
  ub_sync_transaction.user              {|a| u = a.association(:user); u.confirm!; u }
end

Factory.define :ub_sync_transaction_complete, :parent => :ub_sync_transaction do |ub_sync_transaction|
  ub_sync_transaction.items             {|a| [a.association(:ub_sync_transaction_item), a.association(:ub_sync_transaction_item)]}
end
