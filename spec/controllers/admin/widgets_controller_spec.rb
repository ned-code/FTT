require 'spec_helper'

describe Admin::WidgetsController do

  it "should use Admin::WidgetsController" do
    controller.should be_an_instance_of(Admin::WidgetsController)
  end

  context 'accessed by admin user' do

    before do
      sign_in :user, Factory(:admin)
    end


    describe "GET 'index'" do
      it "should be successful" do
        get 'index'
        response.should be_success
      end
    end

    describe "GET 'new'" do
      it "should be successful" do
        get 'new'
        response.should be_success
      end
    end

  end

  context 'accessed by user' do

    before do
      sign_in :user, Factory(:user)
    end

    describe "GET 'index'" do
      it "should not be successful" do
        get 'index'
        response.should_not be_success
      end
    end

    describe "GET 'new'" do
      it "should not be successful" do
        get 'new'
        response.should_not be_success
      end
    end

  end
  
end