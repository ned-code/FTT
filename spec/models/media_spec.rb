# == Schema Information
#
# Table name: medias
#
#  uuid           :string(36)      primary key
#  path           :string(255)     not null
#  mime_type      :string(255)     not null
#  version        :integer         not null
#  storage_config :string(255)
#  created_at     :datetime
#  updated_at     :datetime
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Media do
  should_be_built_by_factory
  should_be_created_by_factory
end