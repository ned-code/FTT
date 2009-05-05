require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe TimesController do
  integrate_views

  before(:each) do
    activate_authlogic
    @current_user = Factory.create(:confirmed_user)
    @current_user.is_registered
    UserSession.create(@current_user)
  end

  describe 'XML API' do

    before(:each) do
      request.env['HTTP_ACCEPT'] = 'application/xml'
    end

    it "'GET /time' should return current time on server" do
      get :show

      response.should be_success
      response.should respond_with(:content_type => :xml)

      response.should have_tag('time', assigns(:current_time).xmlschema)
    end

  end
end