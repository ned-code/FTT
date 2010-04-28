require 'spec_helper'

describe "ViewCounts" do
  
# need to add this test again when public document will be added again  
#  it "view document should create a view_count" do
#    document = Factory(:document)
#    visit document_path(document)
#    ViewCount.last.viewable.should == document
#  end
  
  it "view document should create a view_count with currrent_user" do
    document = Factory(:document)
    sign_in_as_user
    visit document_path(document)
    view_count = ViewCount.last
    view_count.viewable.should == document
    view_count.user.should == @current_user
  end
  
end
