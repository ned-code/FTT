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

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbPageElementState do
end
