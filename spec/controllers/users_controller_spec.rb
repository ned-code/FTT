require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsersController do
  integrate_views

  before(:each) do
    activate_authlogic
  end

  context 'anonymous user' do

    it "should register as user" do
      post :create, :user => Factory.attributes_for(:user)

      # TODO: should be a success
#      response.should be_success
      response.should redirect_to(root_url)
      # TODO: Test if activation mail is send
      # TODO: Better test expression ?
      assigns(:user).should_not be_is_registered
    end

  end

  context 'registred user' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
      UserSession.create(@current_user)
    end

    # TODO: not a success
#    it "should not create user" do
#      post :create, :user => Factory.attributes_for(:user)
#
#      response.should_not be_success
#      response.should be_redirect
#    end

  end

  context 'administrator user' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
      @current_user.is_administrator
      UserSession.create(@current_user)
    end

    it "should create user" do
      post :create, :user => Factory.attributes_for(:user)

      # TODO: should be a success
#      response.should be_success
      response.should redirect_to(users_url)
      # TODO: Test if confirmation mail is not send
      # TODO: Better test expression ?
      assigns(:user).should be_is_registered
    end

  end
end