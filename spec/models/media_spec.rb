# == Schema Information
#
# Table name: medias
#
#  uuid              :string(36)      primary key
#  type              :string(255)
#  file_file_name    :string(255)
#  file_content_type :string(255)
#  file_file_size    :integer
#  file_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Media do
  should_be_built_by_factory
  should_be_created_by_factory
end
