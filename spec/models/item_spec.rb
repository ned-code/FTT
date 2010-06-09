require 'spec_helper'

describe Item do
  
  should_allow_mass_assignment_of :uuid, :media, :media_id, :media_type, :data, :position
  should_not_allow_mass_assignment_of :id, :page_id, :created_at, :updated_at
  
  should_be_built_by_factory
  should_be_created_by_factory
  
  should_belong_to :page
  should_belong_to :media
  
  describe "default" do
    subject { Factory(:item) }
    
    its(:must_notify) { should be_false }
  end
  
end



# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)      primary key
#  page_id    :string(36)      not null
#  media_id   :string(36)
#  media_type :string(255)
#  data       :text(16777215)
#  created_at :datetime
#  updated_at :datetime
#  position   :integer(4)
#  kind       :string(255)
#

