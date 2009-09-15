# == Schema Information
#
# Table name: medias
#
#  id              :integer         not null, primary key
#  uuid            :string(255)
#  path            :string(255)
#  media_type      :string(255)
#  version         :integer
#  item_id :integer
#  created_at      :datetime
#  updated_at      :datetime
#  storage_config  :string(255)
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Media do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
end
