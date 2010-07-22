require 'spec_helper'

describe Discussion do

  describe 'validate_presence_of_object_linked method' do
    before do
      Factory(:theme_without_upload)
      @discussion = Factory.build(:discussion)
    end

    it "should return true if discussion have a object linked" do
      @discussion.valid?.should == true
    end

    it "should return false if discussion don't have any object linked" do
      @discussion.page_id = nil
      @discussion.valid?.should == false
    end
  end

end





# == Schema Information
#
# Table name: discussions
#
#  uuid       :string(36)      not null, primary key
#  page_id    :string(36)
#  deleted_at :datetime
#  properties :text
#  created_at :datetime
#  updated_at :datetime
#  user_id    :string(36)      not null
#

