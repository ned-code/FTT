class UbSyncTransactionItem < ActiveRecord::Base
  belongs_to :transaction, :class_name => 'UbSyncTransaction', :foreign_key => 'ub_sync_transaction_id'

  validates_presence_of :ub_sync_transaction_id, :path, :storage_config,
                        :part_nb, :part_total_nb, :part_total_nb,
                        :part_hash_control, :item_hash_control

  before_validation :set_storage_config
  after_save :save_data_on_storage

  def data
    storage.get(path_with_part)
  end

  def data=(data)
    @tempfile = data
  end

  protected

  def validate
    if @tempfile
      errors.add(:part_hash_control, "isn't equal to hash of data") if  Digest::MD5.file(@tempfile.path).hexdigest != part_hash_control
    end
  end
  
  private

  def set_storage_config
    self.storage_config = storage.identity_string
  end

  def save_data_on_storage
    storage.put(path_with_part, @tempfile) if @tempfile
  end

  def path_with_part
    File.join('sync', transaction.uuid, path + (part_total_nb > 1 ? ".part#{part_nb}" : ''))
  end

  def storage
    Storage::storage(storage_config || {:name => :filesystem})
  end

end
