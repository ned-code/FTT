# == Schema Information
#
# Table name: items
#
#  id               :integer         not null, primary key
#  uniboard_page_id :integer
#  media_id         :integer
#  created_at       :datetime
#  updated_at       :datetime
#  data             :text(65537)
#  uuid             :string(255)
#  element_type     :string(255)     default("object")
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Item do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
end
