# == Schema Information
#
# Table name: medias
#
#  uuid       :string(36)      primary key
#  type       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  properties :text(65537)
#  user_id    :integer
#  file       :string(255)
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Media do
  should_be_built_by_factory
  should_be_created_by_factory
end

