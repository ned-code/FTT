Factory.define :ub_sync_transaction_item do |ub_sync_transaction_item|
  ub_sync_transaction_item.path                   'file.text'
  ub_sync_transaction_item.storage_config         YAML.dump({:name => :filesystem, :basedir => 'spec/tmp/files/transactions/12345'})
  ub_sync_transaction_item.part_nb                1
  ub_sync_transaction_item.part_total_nb          1
  ub_sync_transaction_item.part_hash_control      'xxx'
  ub_sync_transaction_item.item_hash_control      'xxx'

  ub_sync_transaction_item.transaction {|a| a.association(:ub_sync_transaction)}
end
