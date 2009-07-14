class UbSyncTransactionItem < ActiveRecord::Base
  belongs_to :transaction, :class_name => 'UbSyncTransaction', :foreign_key => 'ub_sync_transaction_id'

  validates_presence_of :path, :content_type, :storage_config,
                        :part_nb, :part_total_nb, :part_total_nb,
                        :part_check_sum, :item_check_sum

  before_validation :set_storage_config
  before_save :save_data_on_storage
  before_destroy :delete_data_on_storage


  def data
    storage.get(storage_path)
  end

  def data=(data)
    @tempfile = data
  end

  def storage_path
    File.join('sync', transaction.uuid, path + (part_total_nb > 1 ? ".part#{part_nb}" : ''))
  end

  protected

  def validate
    if @tempfile
      digest = nil
      if (@tempfile.is_a?(StringIO))
        digest = Digest::MD5.hexdigest(@tempfile.string)
      else
        digest = Digest::MD5.file(@tempfile.path).hexdigest
      end
      errors.add(:part_check_sum, "isn't equal to hash of data") if  digest != part_check_sum
    end
  end

  private

  def set_storage_config
    self.storage_config = storage.identity_string
  end

  def save_data_on_storage
    if @tempfile
      storage.put(storage_path, @tempfile)
      if (@tempfile.is_a?(IO))
        if (!@tempfile.closed?)
          @tempfile.close
        end
        File.delete @tempfile.path
        @tempfile = nil
      end
    end
  end
  
  def delete_data_on_storage
     storage.delete(storage_path)
  end

  def storage
    Storage::storage(storage_config)
  end

end
