# == Schema Information
#
# Table name: conversions
#
#  id         :integer         not null, primary key
#  path       :string(255)     not null
#  mime_type  :string(255)     not null
#  parameters :string(255)
#  media_id   :string(36)      not null
#  created_at :datetime
#  updated_at :datetime
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Conversion do
  should_be_built_by_factory
  should_be_created_by_factory
  
  should_belong_to :media

end