require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Media do
  should_be_built_by_factory
  should_be_created_by_factory
end




# == Schema Information
#
# Table name: medias
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(65537)
#  user_id     :integer
#  file        :string(255)
#  system_name :string(255)
#

