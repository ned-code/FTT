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
#  id         :integer         not null, primary key
#  uuid       :string(36)
#  page_id    :integer         not null
#  media_id   :integer
#  media_type :string(255)
#  data       :text(65537)
#  created_at :datetime
#  updated_at :datetime
#  position   :integer
#

