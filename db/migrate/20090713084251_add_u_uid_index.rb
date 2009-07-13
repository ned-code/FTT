class AddUUidIndex < ActiveRecord::Migration
  def self.up
    add_index(:ub_documents, :uuid, { :name => "document_uuid_index", :unique => true })
    add_index(:ub_pages, :uuid, { :name => "page_uuid_index", :unique => true })
    add_index(:ub_pages, :uniboard_document_id, { :name => "doument_fk"})
    add_index(:ub_medias, :uuid, { :name => "media_uuid_index", :unique => true })
    add_index(:ub_medias, :page_element_id, { :name => "page_element_fk"})
    add_index(:ub_sync_transactions, :uuid, { :name => "transaction_uuid_index", :unique => true })

    add_index(:ub_page_elements, :uniboard_page_id, { :name => "page_fk"})
    add_index(:ub_conversions, :media_id, { :name => "media_fk"})
    add_index(:ub_sync_transaction_items, :ub_sync_transaction_id, { :name => "transaction_fk"})
  end

  def self.down
    remove_index(:ub_documents, :document_uuid_index)
    remove_index(:ub_pages, :page_uuid_index)
    remove_index(:ub_pages,:doument_fk)
    remove_index(:ub_medias, :media_uuid_index)
    remove_index(:ub_medias, :page_element_fk)
    remove_index(:ub_sync_transactions, :transaction_uuid_index)

    remove_index(:ub_page_elements, :page_fk)
    remove_index(:ub_conversions, :media_fk)
    remove_index(:ub_sync_transaction_items, :transaction_fk)
  end
end
