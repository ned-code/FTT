require 'spec_helper'

describe CommentsController do

  it "should use CommentsController" do
    controller.should be_an_instance_of(CommentsController)
  end

  context 'accessed for a page by a logged user' do

    before do
      Factory(:theme_without_upload)
      @user = Factory(:user)
      @document = Factory(:document, :creator_id => @user.uuid)
      @discussion = Factory(:discussion, :page => @document.pages.first)
      Comment.stub(:new_with_uuid).and_return(Factory(:comment, :discussion => @discussion, :user => @user))
      sign_in :user, @user
    end

    describe "POST 'create' with discussion_id" do
      it "should be successful" do
        post 'create', { :discussion_id => @discussion.uuid }
        response.should be_success
      end
    end

  end

end