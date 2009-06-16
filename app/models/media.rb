# Attributes
#- uuid: string
#- path: string
#- type: string
#- version: integer
#- page_element_id: integer
#
class Media < ActiveRecord::Base

  belongs_to :page_element, :class_name => 'PageElement', :foreign_key => 'page_element_id'
  has_many :conversions, :class_name => 'Conversion', :foreign_key => 'media_id'
  
  def public_url

  end

  def private_url

  end
end
