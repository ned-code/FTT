require 'spec_helper'

describe Admin::CategoriesController do  
  mock_models :category
  
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

    it "should get categories list when accessing admin/categories path" do
      get :index
      response.should be_success
      response.should respond_with(:content_type => :html)          
    end
    
    it "should get category create page when accessing admin/categories/new path" do
      get :new
      response.should be_success
      response.should respond_with(:content_type => :html)          
    end
  end
  
  context 'accessed by basic user' do

    before(:each) do          
      UserSession.create(@user1)
    end

    it "should not get categories list when accessing admin/categories path" do
      get :index
      response.should_not be_success        
    end
    
    it "should not get category create page when accessing admin/categories/new path" do
      get :new
      response.should_not be_success
      response.should respond_with(:content_type => :html)          
    end
    
  end

end
