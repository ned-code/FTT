require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Item do
  should_be_built_by_factory
  should_be_created_by_factory
  
  should_belong_to :page
  should_belong_to :media
end

# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)
#  page_id    :string(36)      not null
#  media_id   :string(36)
#  media_type :string(255)
#  data       :text(65537)
#  created_at :datetime
#  updated_at :datetime
#

