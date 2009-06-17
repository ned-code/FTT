# Attributes
#- uuid: string
#- path: string
#- type: string
#- version: integer
#- page_element_id: integer
#
class UbMedia < ActiveRecord::Base

  belongs_to :page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  has_many :conversions, :class_name => 'UbConversion', :foreign_key => 'media_id'
  
  def public_url

  end

  def private_url

  end
end
