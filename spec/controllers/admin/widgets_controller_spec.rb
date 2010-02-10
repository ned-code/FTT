require 'spec_helper'

describe Admin::WidgetsController do  
  before(:each) do
    @admin_user = Factory.create(:user)
    @admin_user.has_role!("admin")
    #@user1 = Factory.create(:user)
  end
  
  context 'accessed by admin user' do

    before(:each) do          
      UserSession.create(@admin_user)
    end

    # it "should get widgets list when accessing admin/widgets path" do
    #   get :index
    #   puts response
    #   response.should be_success
    #   response.should respond_with(:content_type => :html)          
    # end
  end

end
