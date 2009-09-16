# == Schema Information
#
# Table name: conversions
#
#  id         :integer         not null, primary key
#  path       :string(255)     not null
#  mime_type  :string(255)     not null
#  parameters :string(255)
#  media_id   :string(36)      not null
#  created_at :datetime
#  updated_at :datetime
#

class Conversion < ActiveRecord::Base

  # ================
  # = Associations =
  # ================

  belongs_to :media

  # =============
  # = Callbacks =
  # =============

  before_save :save_data_on_storage
  before_destroy :delete_data_on_storage
  
  # ====================
  # = Instance Methods =
  # ====================

  def data
    storage.get(path)
  end

  def data=(data)
    @tempfile = data
  end
  
  def public_url
    storage.public_url(self.path)
  end

  def private_url
    storage.private_url(self.path)
  end

private

  def save_data_on_storage
    if @tempfile
      storage.put(path, @tempfile)
      if (@tempfile.is_a?(IO) && !@tempfile.closed?)
        @tempfile.close
      end
      @tempfile = nil
    end
  end

  def delete_data_on_storage
     storage.delete(path)
  end
  
  def storage
    Storage::storage(media.storage_config)
  end
end
