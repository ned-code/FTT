require 'spec_helper'

describe DocumentsController do
  mock_models :document
  
  # describe :post => :create, :document => {} do
  #   mime Mime::JSON
  #   expects :new, :on => Document, :with => {}, :returns => mock_document
  #   expects :pages, :on => mock_document, :returns => Page 
  #   expects :build, :on => Page
  #   expects :save, :on => mock_document, :returns => true
  #   expects :to_json, :on => mock_document, :returns => {}
  #   
  #   should_assign_to :document, :with => mock_document
  #   should_respond_with :success, :content_type => Mime::JSON
  # end

  before(:each) do
    activate_authlogic
    @document1 = Factory.create(:document, :title => "doc 1")
    @document2 = Factory.create(:document, :title => "doc 2")    
    @document3 = Factory.create(:document, :title => "doc 3")
    @document4 = Factory.create(:document, :title => "doc 4")    
  end

  context 'accessed by admin user' do

    before(:each) do
      User.create({:password => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :password_confirmation => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :name => "All", :email => "All@mnemis.com"})          
      @current_user = Factory.create(:user)
      @current_user.has_role!("admin")
      UserSession.create(@current_user)
    end

    it "should be able to get index page of documents" do
      get :index
      response.should be_success
      response.should respond_with(:content_type => :html)             
    end
    
    it "should get all documents" do
      get :index, :format => "json"
      response.should be_success      
      response.should respond_with(:content_type => :json)     
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 4
    end
    
    it "should be able to open any document" do
      get :show, :id => @document1.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)      
    end
    
    it "should be able to delete any document" do
      get :destroy, :id => @document2.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)      
    end
        
    it "should be able to rename any document" do
      get :update, :id => @document3.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)      
    end
        
    it "should be able to create a new document" do
      @new_doc = Factory.create(:document, :title => "new")    
      
      post :create, :id => @new_doc.uuid, :format => "json", :document => { :title => "new doc", :uuid => @new_doc.uuid}
      response.should be_success
      response.should respond_with(:content_type => :json)      
      @current_user.has_role?("owner", Document.find_by_uuid(@new_doc.uuid)).should be_true          
    end 
  end
  
  context 'accessed by anonymous user' do
    before(:each) do
    end

    it "should not be able to get index page of documents" do
      get :index
      response.should redirect_to(login_url)
    end
    it "should not get all documents" do
      get :index, :format => "json"
      response.should_not be_success
    end
    
    it "should not be able to open any document" do
      get :show, :id => @document1.uuid
      response.should_not be_success
    end
    
    it "should not be able to delete any document" do
      get :destroy, :id => @document2.uuid, :format => "json"
      response.should_not be_success
   end
        
    it "should not be able to rename any document" do
      get :update, :id => @document3.uuid, :format => "json"
      response.should_not be_success
    end
        
    it "should not be able to create a new document" do
      @new_doc = Factory.create(:document, :title => "new")          
      post :create, :id => @new_doc.uuid, :format => "json", :document => { :title => "new doc", :uuid => @new_doc.uuid}
      response.should_not be_success
    end    
  end  
  
  context 'accessed by logged user' do

    before(:each) do
      User.create({:password => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :password_confirmation => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :name => "All", :email => "All@mnemis.com"})          
      @current_user = Factory.create(:user)
      @current_user.has_role!("owner", @document1)
      @current_user.has_role!("reader", @document2)
      @current_user.has_role!("editor", @document3)            
      UserSession.create(@current_user)
    end

    it "should be able to get index page of documents" do
      get :index
      response.should be_success
      response.should respond_with(:content_type => :html)             
    end
    
    it "should get available documents based of its roles" do
      get :index, :format => "json"
      response.should be_success      
      response.should respond_with(:content_type => :json)     
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 3
    end
    
    it "should be able to open documents based of its roles" do
      get :show, :id => @document1.uuid
      response.should be_success
      response.should respond_with(:content_type => :html) 
      get :show, :id => @document2.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)
      get :show, :id => @document3.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)
      get :show, :id => @document4.uuid
      response.should_not be_success
    end
    
    it "should be able to delete owned documents" do
      get :destroy, :id => @document1.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)  
      get :destroy, :id => @document2.uuid, :format => "json"
      response.should_not be_success
      get :destroy, :id => @document3.uuid, :format => "json"
      response.should_not be_success
      get :destroy, :id => @document4.uuid, :format => "json"
      response.should_not be_success            
    end
        
    it "should be able to rename owned document" do
      get :update, :id => @document1.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)  
      get :update, :id => @document2.uuid, :format => "json"
      response.should_not be_success
      get :update, :id => @document3.uuid, :format => "json"
      response.should_not be_success
      get :update, :id => @document4.uuid, :format => "json"
      response.should_not be_success   
    end
        
    it "should be able to create a new document" do
      @new_doc = Factory.create(:document, :title => "new")    
      
      post :create, :id => @new_doc.uuid, :format => "json", :document => { :title => "new doc", :uuid => @new_doc.uuid}
      response.should be_success
      response.should respond_with(:content_type => :json)  
      
      @current_user.has_role?("owner", Document.find_by_uuid(@new_doc.uuid)).should be_true    
    end 
  end  
end