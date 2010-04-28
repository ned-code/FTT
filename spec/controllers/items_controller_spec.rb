require 'spec_helper'

describe ItemsController do
  include Devise::TestHelpers
  mock_models :document, :page, :item
  
  before(:each) { mock_item(:to_json => {}, :must_notify= => {}) }
  
  describe "with public document" do
    before(:each) { mock_document(:is_public? => true) }
    
    context "accessed by admin" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :new, :on => Item, :returns => mock_item
        expects :must_notify=, :on => mock_item, :with => true
        expects :save, :on => mock_item
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :update_attributes, :on => mock_item, :with => { "must_notify" => true }
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :destroy, :on => mock_item
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :new, :on => Item, :returns => mock_item
        expects :must_notify=, :on => mock_item, :with => true
        expects :save, :on => mock_item
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :update_attributes, :on => mock_item, :with => { "must_notify" => true }
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :destroy, :on => mock_item
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
    end
    
    context "accessed by anonymous" do
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        expects :items, :on => mock_page, :returns => Item
#        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
#        should_respond_with :success, :content_type => :html
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
    end
  end
  
  describe "with private document" do
    before(:each) { mock_document(:is_public? => false, :to_json => {}) }
    
    context "accessed by admin" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :new, :on => Item, :returns => mock_item
        expects :must_notify=, :on => mock_item, :with => true
        expects :save, :on => mock_item
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :update_attributes, :on => mock_item, :with => { "must_notify" => true }
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :destroy, :on => mock_item
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :new, :on => Item, :returns => mock_item
        expects :must_notify=, :on => mock_item, :with => true
        expects :save, :on => mock_item
        should_respond_with :success, :content_type => :json
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :update_attributes, :on => mock_item, :with => { "must_notify" => true }
        should_respond_with :success, :content_type => :json
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        expects :destroy, :on => mock_item
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        expects :items, :on => mock_page, :returns => Item
        expects :find_by_uuid, :on => Item, :with => "uuid", :returns => mock_item
        should_respond_with :success, :content_type => :html
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
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
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
        expects :pages, :on => mock_document, :returns => Page
        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
        should_respond_with :not_found
      end
    end
    
    context "accessed by anonymous" do
      
      describe :get => :show, :document_id => "1", :page_id => "uuid", :id => "uuid" do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :post => :create, :document_id => "1", :page_id => "uuid", :item => {} do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :put => :update, :document_id => "1", :page_id => "uuid", :id => "uuid", :item => {} do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
      describe :delete => :destroy, :document_id => "1", :page_id => "uuid", :id => "uuid" do
#        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#        expects :pages, :on => mock_document, :returns => Page
#        expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
#        should_respond_with :not_found
        should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
      end
    end
  end
  
end