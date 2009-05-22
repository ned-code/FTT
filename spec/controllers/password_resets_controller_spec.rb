require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PasswordResetsController do
  integrate_views

  before(:each) do
    activate_authlogic
  end

  context 'accessed by a anonymous user' do

    it "'GET /users/password_reset/new' should be rendered" do
      get :new

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'POST /users/password_reset' should send email if user exist" do
      user = Factory.create(:confirmed_user)
      post :create, :email => user.email

      response.should redirect_to(new_session_url)
      response.should respond_with(:content_type => :html)

      response.should send_email do
      end
    end

    it "'POST /users/password_reset' should not send email if user don't exist" do
      user = Factory.build(:confirmed_user) # Don't save user, email is uniqu and don'it exist in database if not saved!
      post :create, :email => user.email

      response.should redirect_to(new_session_url)
      response.should respond_with(:content_type => :html)

      response.should_not send_email do
      end
    end

  end
end
