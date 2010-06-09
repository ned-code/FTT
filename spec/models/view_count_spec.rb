require 'spec_helper'

describe ViewCount do
  
  should_allow_mass_assignment_of :user_id, :session_id, :ip_address
  should_not_allow_mass_assignment_of :id, :viewable_id, :viewable_type, :created_at
  
  should_belong_to :user
  should_belong_to :viewable, :polymorphic => true#, :counter_cache => true
  
  context "with already one view_count in db" do
    before(:each) { Factory(:view_count) }
    
    should_validate_uniqueness_of :session_id, :scope => [:viewable_id, :viewable_type]
  end
  
  it "should increment document views_count" do
    document = Factory(:document)
    lambda { Factory(:view_count, :viewable => document) }.should change { document.reload.views_count }.by(1)
  end
  
end



# == Schema Information
#
# Table name: view_counts
#
#  viewable_id   :string(36)
#  viewable_type :string(255)
#  user_id       :string(36)
#  session_id    :string(255)
#  ip_address    :string(255)
#  created_at    :datetime
#  uuid          :string(36)      primary key
#

