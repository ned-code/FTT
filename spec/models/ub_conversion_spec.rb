# == Schema Information
#
# Table name: ub_conversions
#
#  id         :integer         not null, primary key
#  path       :string(255)
#  media_type :string(255)
#  parameters :string(255)
#  media_id   :integer
#  created_at :datetime
#  updated_at :datetime
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UbConversion do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
end
