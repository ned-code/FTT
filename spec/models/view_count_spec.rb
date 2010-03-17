require 'spec_helper'

describe ViewCount do
  
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
#  id            :integer         not null, primary key
#  viewable_id   :integer
#  viewable_type :string(255)
#  user_id       :integer
#  session_id    :string(255)
#  ip_address    :string(255)
#  created_at    :datetime
#

