class UbPageElementState < ActiveRecord::Base

  belongs_to :ub_page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  validates_presence_of :data, :page_element_id
end
