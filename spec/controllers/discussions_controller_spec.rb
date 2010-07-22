require 'spec_helper'

describe DiscussionsController do

  it "should use DiscussionsController" do
    controller.should be_an_instance_of(DiscussionsController)
  end

  context 'accessed for a page by a logged user' do

    before do
      Factory(:theme_without_upload)      
      @page = Factory(:page)
      sign_in :user, Factory(:user)
    end

    describe "GET 'index'" do
      it "should be successful" do
        get 'index', { :page_id => @page.uuid }
        response.should be_success
      end
    end

  end

end