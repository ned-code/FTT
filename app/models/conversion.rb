# Attributes
#- path: string
#- type: string
#- parameters: string
#- media_id: integer
#
class Conversion < ActiveRecord::Base

  belongs_to :media, :class_name => 'UbMedia', :foreign_key => 'media_id'

  def public_url

  end

  def private_url

  end
end
