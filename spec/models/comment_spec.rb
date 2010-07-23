require 'spec_helper'

describe Comment do

  describe 'root attribute' do
    before do
      Factory(:theme_without_upload)
      @discussion = Factory(:discussion)
      @comment_1 = Factory(:comment, :discussion => @discussion)
      @comment_2 = Factory(:comment, :discussion => @discussion)
    end

    it "should be true if it's the first comment" do
      @comment_1.root.should == true
    end

    it "should be false if it's not the first comment" do
      @comment_2.root.should === false
    end
  end

end


# == Schema Information
#
# Table name: comments
#
#  uuid          :string(36)      not null, primary key
#  discussion_id :string(36)      not null
#  user_id       :string(36)      not null
#  content       :text
#  deleted_at    :datetime
#  root          :boolean(1)
#  created_at    :datetime
#  updated_at    :datetime
#

