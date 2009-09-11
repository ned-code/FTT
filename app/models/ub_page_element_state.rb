# == Schema Information
#
# Table name: ub_page_element_states
#
#  id              :integer         not null, primary key
#  data            :string(255)     not null
#  page_element_id :integer         not null
#  deleted         :boolean
#  created_at      :datetime
#  updated_at      :datetime
#

class UbPageElementState < ActiveRecord::Base

  belongs_to :ub_page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  validates_presence_of :data, :page_element_id
end
