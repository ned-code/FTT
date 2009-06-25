Factory.define :ub_sync_transaction_item do |ub_sync_transaction_item|
  ub_sync_transaction_item.path                   'sync-transaction-item.txt'
  ub_sync_transaction_item.storage_config         YAML.dump({:name => :filesystem, :basedir => 'spec/tmp/files/transactions/12345'})
  ub_sync_transaction_item.part_nb                1
  ub_sync_transaction_item.part_total_nb          1
  ub_sync_transaction_item.part_check_sum         {|a| Digest::MD5.file(fixture_file(a.path)).hexdigest }
  ub_sync_transaction_item.item_check_sum         {|a| Digest::MD5.file(fixture_file(a.path)).hexdigest }

  ub_sync_transaction_item.data                   {|a| mock_uploaded_file(a.path) }

  ub_sync_transaction_item.transaction {|a| a.association(:ub_sync_transaction)}
end
