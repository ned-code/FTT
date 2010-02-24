require 'spec_helper'

describe Admin::WidgetsController do  
  mock_models :widget
  
  before(:each) do
    activate_authlogic 
    @admin_user = Factory.create(:user)
    @admin_user.has_role!("admin")
    @user1 = Factory.create(:user)
  end
  
  context 'accessed by admin user' do

    before(:each) do          
      UserSession.create(@admin_user)
    end

    it "should get widgets list when accessing admin/apps path" do
      get :index
      response.should be_success
      response.should respond_with(:content_type => :html)          
    end
    
    it "should get widget create page when accessing admin/apps/new path" do
      get :new
      response.should be_success
      response.should respond_with(:content_type => :html)          
    end
  end
  
  context 'accessed by basic user' do

    before(:each) do          
      UserSession.create(@user1)
    end

    it "should not get widgets list when accessing admin/apps path" do
      get :index
      response.should_not be_success        
    end
    
    it "should not get widget create page when accessing admin/apps/new path" do
      get :new
      response.should_not be_success
      response.should respond_with(:content_type => :html)          
    end
    
  end

end
