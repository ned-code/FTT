
class UbPageElement < ActiveRecord::Base

  belongs_to :page, :class_name => 'UbPage', :foreign_key => 'uniboard_page_id'
  belongs_to :media, :dependent => :destroy, :class_name => 'UbMedia', :foreign_key => 'media_id'
  has_many :states, :class_name => 'UbPageElementState', :foreign_key => 'page_element_id',
    :order => 'updated_at DESC', :autosave => true, :dependent => :destroy

  def update_from_svg(svg_dom_element)
    # TODO implement parsing of svg when data will be stored in page element
  end
end
