require 'spec_helper'

describe PagesController do
  include Devise::TestHelpers
  mock_models :document, :page
  
  before(:each) { mock_page(:to_json => {}) }
  
  describe "with public document" do
    before(:each) { mock_document(:public? => true) }
    
    context "accessed by admin" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
        expects :uuid=, :on => mock_page, :with => "uuid"
        expects :save, :on => mock_page, :returns => true
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :update_attributes, :on => mock_page, :with => {}
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :destroy, :on => mock_page
        should_respond_with :success, :content_type => :json
      end
    end
    
    context "accessed by editor" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
        expects :uuid=, :on => mock_page, :with => "uuid"
        expects :save, :on => mock_page, :returns => true
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :update_attributes, :on => mock_page, :with => {}
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :destroy, :on => mock_page
        should_respond_with :success, :content_type => :json
      end
    end
    
    context "accessed by reader" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
    end
    
    context "accessed by user" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
    end
    
    context "accessed by anonymous" do
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        should_respond_with :forbidden
      end
    end
  end
  
  describe "with private document" do
    before(:each) { mock_document(:public? => false, :to_json => {}) }
    
    context "accessed by admin" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
        expects :uuid=, :on => mock_page, :with => "uuid"
        expects :save, :on => mock_page, :returns => true
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :update_attributes, :on => mock_page, :with => {}
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :destroy, :on => mock_page
        should_respond_with :success, :content_type => :json
      end
    end
    
    context "accessed by editor" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
        expects :uuid=, :on => mock_page, :with => "uuid"
        expects :save, :on => mock_page, :returns => true
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :update_attributes, :on => mock_page, :with => {}
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :destroy, :on => mock_page
        should_respond_with :success, :content_type => :json
      end
    end
    
    context "accessed by reader" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => []
        should_respond_with :success, :content_type => :json
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid_or_position, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
    end
    
    context "accessed by user" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
        @mock_user.stub(:has_role?).with("admin").and_return(false)
        @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
        @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
    end
    
    context "accessed by anonymous" do
      
      describe :get => :index, :document_id => "1" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :get => :show, :document_id => "1", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        should_respond_with :forbidden
      end
      describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
        should_respond_with :forbidden
      end
      describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
        should_respond_with :forbidden
      end
      describe :delete => :destroy, :document_id => "1", :id => "uuid" do
        should_respond_with :forbidden
      end
    end
  end
  
end