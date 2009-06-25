# Attributes
#- path: string
#- type: string
#- parameters: string
#- media_id: integer
#
class UbConversion < ActiveRecord::Base

  belongs_to :media, :class_name => 'UbMedia', :foreign_key => 'media_id'

  
  def public_url
    Storage::storage(self.media.storage_config).public_url(self.path)
  end

  def private_url
    Storage::storage(self.media.storage_config).private_url(self.path)
  end
end
