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
    @global_user = User.create({:password => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :password_confirmation => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :name => "All", :email => "All@mnemis.com"})    
    @admin_user = Factory.create(:user)
    @admin_user.has_role!("admin")
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)    

    @read_doc = Factory.create(:document, :title => "read_doc")
    @edit_doc = Factory.create(:document, :title => "edit_doc")    
    @owner_doc = Factory.create(:document, :title => "owner_doc")
    @global_read_doc = Factory.create(:document, :title => "global_read_doc")
    @global_edit_doc = Factory.create(:document, :title => "global_edit_doc")
    @private_doc = Factory.create(:document, :title => "private doc")
    @global_user.has_role!("reader", @global_read_doc)
    @global_user.has_role!("editor", @global_edit_doc)    
    @user1.has_role!("reader", @read_doc)
    @user1.has_role!("editor", @edit_doc)
    @user1.has_role!("owner", @owner_doc)        
    
    @user2.has_role!("owner", @private_doc)
    
    # Object creation for document filter tests
    @jim = Factory.create(:user, :name => 'Jim')
    @jack = Factory.create(:user, :name => 'Jack')
    
    # Jim's docs
    @jim_perso_doc = Factory.create(:document, :title => 'jim_perso_doc')
    @jim.has_role!("owner", @jim_perso_doc)
    @jim_shared_with_jack_owner = Factory.create(:document, :title => 'jim_shared_with_jack_owner')
    @jack.has_role!("owner", @jim_shared_with_jack_owner)
    @jim.has_role!("owner", @jim_shared_with_jack_owner)
    @jim_shared_with_jack_reader = Factory.create(:document, :title => 'jim_shared_with_jack_reader')
    @jim.has_role!("owner", @jim_shared_with_jack_reader)
    @jack.has_role!("reader", @jim_shared_with_jack_reader)
    @jim_shared_with_jack_editor = Factory.create(:document, :title => 'jim_shared_with_jack_editor')
    @jim.has_role!("owner", @jim_shared_with_jack_editor)
    @jack.has_role!("editor", @jim_shared_with_jack_editor)
    @jim_shared_with_all_owner = Factory.create(:document, :title => 'jim_shared_with_all_owner')
    @jim.has_role!("owner", @jim_shared_with_all_owner)
    @global_user.has_role!("owner", @jim_shared_with_all_owner)
    @jim_shared_with_all_reader = Factory.create(:document, :title => 'jim_shared_with_all_reader')
    @jim.has_role!("owner", @jim_shared_with_all_reader)
    @global_user.has_role!("reader", @jim_shared_with_all_reader)
    @jim_shared_with_all_editor = Factory.create(:document, :title => 'jim_shared_with_all_editor')
    @jim.has_role!("owner", @jim_shared_with_all_editor)
    @global_user.has_role!("editor", @jim_shared_with_all_editor)
    
    # Jack's docs
    @jack_perso_doc = Factory.create(:document, :title => 'jack_perso_doc')
    @jack.has_role!("owner", @jack_perso_doc)
    @jack_shared_with_jim_owner = Factory.create(:document, :title => 'jack_shared_with_jim_owner')
    @jack.has_role!("owner", @jack_shared_with_jim_owner)
    @jim.has_role!("owner", @jack_shared_with_jim_owner)
    @jack_shared_with_jim_reader = Factory.create(:document, :title => 'jack_shared_with_jim_reader')
    @jack.has_role!("owner", @jack_shared_with_jim_reader)
    @jim.has_role!("reader", @jack_shared_with_jim_reader)
    @jack_shared_with_jim_editor = Factory.create(:document, :title => 'jack_shared_with_jim_editor')
    @jack.has_role!("owner", @jack_shared_with_jim_editor)
    @jim.has_role!("editor", @jack_shared_with_jim_editor)
    @jack_shared_with_all_owner = Factory.create(:document, :title => 'jack_shared_with_all_owner')
    @jack.has_role!("owner", @jack_shared_with_all_owner)
    @global_user.has_role!("owner", @jack_shared_with_all_owner)
    @jack_shared_with_all_reader = Factory.create(:document, :title => 'jack_shared_with_all_reader')
    @jack.has_role!("owner", @jack_shared_with_all_reader)
    @global_user.has_role!("reader", @jack_shared_with_all_reader)
    @jack_shared_with_all_editor = Factory.create(:document, :title => 'jack_shared_with_all_editor')
    @jack.has_role!("owner", @jack_shared_with_all_editor)
    @global_user.has_role!("editor", @jack_shared_with_all_editor)
    
  end
  
  context 'accessed by anonymous user' do
    before(:each) do
      session = UserSession.find      
      session.destroy
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
      get :show, :id => @edit_doc.uuid
      response.should_not be_success
    end
    
    it "should not be able to delete any document" do
      get :destroy, :id => @private_doc.uuid, :format => "json"
      response.should_not be_success
   end
        
    it "should not be able to rename any document" do
      get :update, :id => @global_edit_doc.uuid, :format => "json"
      response.should_not be_success
    end
        
    it "should not be able to create a new document" do
      @new_doc = Factory.create(:document, :title => "new")          
      post :create, :id => @new_doc.uuid, :format => "json", :document => { :title => "new doc", :uuid => @new_doc.uuid}
      response.should_not be_success
    end    
  
  end
  
  context 'accessed by admin user' do

    before(:each) do
      UserSession.create(@admin_user)
    end

    it "should be able to get index page of documents" do
      get :index
      response.should be_success
      response.should respond_with(:content_type => :html)             
    end
    
    it "should get only its owned documents" do
      get :index, :format => "json"
      response.should be_success      
      response.should respond_with(:content_type => :json)     
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 8
    end
    
    it "should be able to open any document" do
      get :show, :id => @global_edit_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)      
    end
    
    it "should be able to delete any document" do
      get :destroy, :id => @private_doc.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)      
    end
        
    it "should be able to rename any document" do
      get :update, :id => @read_doc.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)      
    end
        
    it "should be able to create a new document" do
      @new_uuid = UUID.generate      
      
      
      post :create, :format => "json", :document => { :title => "new doc", :uuid => @new_uuid}
      response.should be_success
      response.should respond_with(:content_type => :json)      
      @admin_user.has_role?("owner", Document.find_by_uuid(@new_uuid)).should be_true          
    end 
    
    it "should be able to use owner filter on index page of documents" do
      get :index, :document_filter => 'owner'
      response.should be_success
    end
    
    it "should be able to use editor filter on index page of documents" do
      get :index, :document_filter => 'editor'
      response.should be_success
    end
    
    it "should be able to use reader filter on index page of documents" do
      get :index, :document_filter => 'reader'
      response.should be_success
    end
  end
  
  context 'accessed by logged user' do

    before(:each) do          
      UserSession.create(@user1)
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
      json_response.length.should == 11
    end
    
    it "should be able to open documents based of its roles" do
      get :show, :id => @global_edit_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html) 
      get :show, :id => @global_read_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)
      get :show, :id => @read_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)
      get :show, :id => @edit_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)
      get :show, :id => @owner_doc.uuid
      response.should be_success
      response.should respond_with(:content_type => :html)            
      get :show, :id => @private_doc.uuid
      response.should_not be_success
    end
    
    it "should be able to delete owned documents" do
      get :destroy, :id => @owner_doc.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)  
      get :destroy, :id => @read_doc.uuid, :format => "json"
      response.should_not be_success
      get :destroy, :id => @edit_doc.uuid, :format => "json"
      response.should_not be_success
      get :destroy, :id => @global_read_doc.uuid, :format => "json"
      response.should_not be_success       
      get :destroy, :id => @global_edit_doc.uuid, :format => "json"
      response.should_not be_success
      get :destroy, :id => @private_doc.uuid, :format => "json"
      response.should_not be_success                 
    end
        
    it "should be able to rename owned document" do
      get :update, :id => @owner_doc.uuid, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)  
      get :update, :id => @read_doc.uuid, :format => "json"
      response.should_not be_success
      get :update, :id => @edit_doc.uuid, :format => "json"
      response.should_not be_success
      get :update, :id => @global_read_doc.uuid, :format => "json"
      response.should_not be_success       
      get :update, :id => @global_edit_doc.uuid, :format => "json"
      response.should_not be_success
      get :update, :id => @private_doc.uuid, :format => "json"
      response.should_not be_success
    end
        
    it "should be able to create a new document" do
      @new_uuid = UUID.generate  
      
      post :create, :format => "json", :document => { :title => "new doc", :uuid => @new_uuid}
      response.should be_success
      response.should respond_with(:content_type => :json)  
      created_doc = Document.find_by_uuid(@new_uuid)
      @user1.has_role?("owner", created_doc).should be_true    
    end 
  end
  
  context 'accessed by logged user - test filters with user jim' do

    before(:each) do          
      UserSession.create(@jim)
    end

    it "should get available documents based on its role without filter" do
      get :index, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 15              
    end
    
    it "should get available documents based on its role with owner filter" do
      get :index, :document_filter => 'owner', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 9              
    end
    
    it "should get available documents based on its role with reader filter" do
      get :index, :document_filter => 'reader', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 3              
    end
    
    it "should get available documents based on its role with editor filter" do
      get :index, :document_filter => 'editor', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 3              
    end
  end  
  
  context 'accessed by logged user - test filters with user jack' do

    before(:each) do          
      UserSession.create(@jack)
    end

    it "should get available documents based on its role without filter" do
      get :index, :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 15              
    end
    
    it "should get available documents based on its role with owner filter" do
      get :index, :document_filter => 'owner', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 9              
    end
    
    it "should get available documents based on its role with reader filter" do
      get :index, :document_filter => 'reader', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 3              
    end
    
    it "should get available documents based on its role with editor filter" do
      get :index, :document_filter => 'editor', :format => "json"
      response.should be_success
      response.should respond_with(:content_type => :json)
      json_response = JSON.parse(response.body)
      json_response.should be_an_instance_of(Array)
      json_response.length.should == 3              
    end
  end  
end