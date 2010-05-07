require 'spec_helper'

describe DocumentsController do
  include Devise::TestHelpers
  
  context "with public document" do
    before(:each) do
       @mock_document = mock_model(Document, :is_public? => true, :to_json => {}, :view_counts => ViewCount)
       ViewCount.stub(:create)
    end
    
    context "accessed by admin" do
      before(:each) do 
        @mock_user = mock_model(User, :active? => true, :confirmed? => true)
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end
      
      it "should respond with success to GET :index" do
        get :index
        response.should be_success
      end
      it "should respond with success to GET :explore" do
        Document.stub(:all_public_paginated_with_explore_params)
        get :explore
        response.should be_success
      end
      it "should respond with success to GET :show" do
        Document.stub(:find_by_uuid).with('1').and_return(@mock_document)
        get :show, :id => '1'
        response.should be_success
      end
      it "should respond with success to POST :create" do
        @mock_user.stub_chain(:documents, :create)
        post :create, :document => {}
        response.should be_success
      end
      it "should respond with success to PUT :update" do
        Document.stub(:find_by_uuid).with('1').and_return(@mock_document)
        @mock_document.stub(:update_attributes)
        put :update, :document => {}, :id => '1'
        response.should be_success
      end
      it "should respond with success to DELETE :destoy" do
        Document.stub(:find_by_uuid).with('1').and_return(@mock_document)
        @mock_document.stub(:destroy)
        delete :destroy, :id => '1'
        response.should be_success
      end
    end
  end
  
#   mock_models :document
#   
#   describe "with public document" do
#     
#     context "accessed by admin" do
#       
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :destroy, :on => mock_document
#         should_respond_with :success, :content_type => :json
#       end
#     end
#     
#     context "accessed by editor" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :update_attributes, :on => mock_document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :destroy, :on => mock_document
#         should_respond_with :success, :content_type => :json
#       end
#     end
#     
#     context "accessed by reader" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#     end
#     
#     context "accessed by user" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#     end
#     
#     context "accessed by anonymous" do
#       
#       describe :get => :index do
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :get => :show, :id => "1" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
# #        should_respond_with :success, :content_type => :html
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :post => :create, :document => {} do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :put => :update, :id => "1", :document => {} do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')        
#       end
#       describe :delete => :destroy, :id => "1" do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')        
#       end
#     end
#   end
#   
#   describe "with private document" do
#     before(:each) do
#        mock_document(:is_public? => false, :to_json => {}, :view_counts => ViewCount)
#        ViewCount.stub(:create)
#     end
#     
#     context "accessed by admin" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
#         @mock_user.stub(:has_role?).with("admin").and_return(true)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :update_attributes, :on => mock_document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :destroy, :on => mock_document
#         should_respond_with :success, :content_type => :json
#       end
#     end
#     
#     context "accessed by editor" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :update_attributes, :on => mock_document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         expects :destroy, :on => mock_document
#         should_respond_with :success, :content_type => :json
#       end
#     end
#     
#     context "accessed by reader" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :success, :content_type => :html
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#     end
#     
#     context "accessed by user" do
#       before(:each) do 
#         @mock_user = mock_model(User, :active? => true, :confirmed? => true)
#         @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
#         @mock_user.stub(:has_role?).with("admin").and_return(false)
#         @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
#         @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
#         User.stub(:find).and_return(@mock_user)
#         sign_in :user, @mock_user
#       end
#       
#       describe :get => :index do
#         #expects :all_with_filter, :on => Document, :returns => []
#         should_respond_with :success, :content_type => :html
#       end
#       describe :get => :show, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#       describe :post => :create, :document => {} do
#         expects :documents, :on => lambda { @mock_user }, :returns => Document
#         expects :create, :on => Document, :with => {}
#         should_respond_with :success, :content_type => :json
#       end
#       describe :put => :update, :id => "1", :document => {} do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#       describe :delete => :destroy, :id => "1" do
#         expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_respond_with :not_found
#       end
#     end
#     
#     context "accessed by anonymous" do
#       
#       describe :get => :index do
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :get => :show, :id => "1" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :post => :create, :document => {} do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#       describe :put => :update, :id => "1", :document => {} do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')        
#       end
#       describe :delete => :destroy, :id => "1" do
# #        should_respond_with :not_found
#         should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
#       end
#     end
#   end
  
end