require "conversion/ub_page_converter"
class UbPageElement < ActiveRecord::Base

  belongs_to :page, :class_name => 'UbPage', :foreign_key => 'uniboard_page_id'
  belongs_to :media, :dependent => :destroy, :class_name => 'UbMedia', :foreign_key => 'media_id'
  has_many :states, :class_name => 'UbPageElementState', :foreign_key => 'page_element_id',
    :order => 'updated_at DESC', :autosave => true, :dependent => :destroy

  def update_from_svg(svg_dom_element, page_width, page_height)
    page_converter = ConversionService::UbPageConverter.new
    json_hash = page_converter.get_json_for_element(svg_dom_element, page_width, page_height)
    json_hash[:uuid] = self.uuid
    self.data = json_hash.to_json
  end
end
