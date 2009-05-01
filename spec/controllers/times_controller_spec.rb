require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe TimesController do
  integrate_views

  before(:each) do
    activate_authlogic
    @current_user = Factory.create(:confirmed_user)
    @current_user.is_registered
    UserSession.create(@current_user)
  end

  it 'should get current time server' do
    get :show

    response.should be_success
    response.should have_tag('time', assigns(:current_time).xmlschema)
  end
end