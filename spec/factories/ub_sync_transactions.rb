Factory.define :ub_sync_transaction do |ub_sync_transaction|
  ub_sync_transaction.uuid              {|a| UUID.generate }
  ub_sync_transaction.ub_client_uuid    {|a| UUID.generate }
  ub_sync_transaction.ub_document_uuid  {|a| UUID.generate }
  ub_sync_transaction.user_id           {|a| UUID.generate }
end
