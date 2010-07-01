require 'spec_helper'

describe PagesController do

  describe "with public document" do

    before(:each) do
      @mock_document = mock_model(Document, {
              :is_public? => true
      })
      @mock_page = mock_model(Page, {
              :to_json => {},
              :must_notify= => true,
              :deep_notify => false,
              :update_attributes => {},
              :update_attributes! => {},
              :reload => nil
      })
    end

    context "accessed by admin" do

      before do
        @mock_user = mock_model(User,
                                :active? => true,
                                :confirmed? => true
        )
        @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
        @mock_user.stub(:has_role?).with("admin").and_return(true)
        User.stub(:find).and_return(@mock_user)
        sign_in :user, @mock_user
      end

      describe "GET 'index' with document_id '1'" do
        it "should not be successful" do
          Document.should_receive(:find_by_uuid).with("1").and_return(@mock_document)
          @mock_document.should_receive(:pages).and_return([])
          get :index, :document_id => "1"
          response.should be_success
        end
      end

      describe "GET 'show' with document_id '1', id 'uuid'" do
        it "should not be successful" do
          Document.should_receive(:find_by_uuid).with("1").and_return(@mock_document)
          @mock_document.should_receive(:pages).and_return(Page)
          Page.should_receive(:find_by_uuid_or_position!).with("uuid").and_return(@mock_page)
          get :show, :document_id => "1", :id => 'uuid'
          response.should be_success
        end
      end

      

    end

  end

end


  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
  #       expects :save!, :on => mock_page, :returns => true
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :update_attributes!, :on => mock_page, :with => {}
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :destroy, :on => mock_page
  #       should_respond_with :success, :content_type => :json
  #     end
  #   end
  #
  #   context "accessed by editor" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
  #       expects :save!, :on => mock_page, :returns => true
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :update_attributes!, :on => mock_page, :with => {}
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :destroy, :on => mock_page
  #       should_respond_with :success, :content_type => :json
  #     end
  #   end
  #
  #   context "accessed by reader" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #   end
  #
  #   context "accessed by user" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #   end
  #
  #   context "accessed by anonymous" do
  #
  #     describe :get => :index, :document_id => "1" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
# #        expects :pages, :on => mock_document, :returns => []
# #        should_respond_with :success, :content_type => :json
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
# #        expects :pages, :on => mock_document, :returns => Page
# #        expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
# #        should_respond_with :success, :content_type => :html
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #   end
  # end
  #
  # describe "with private document" do
  #   before(:each) do
  #     mock_document(:is_public? => false, :to_json => {})
  #     @mock_page = mock_page
  #     @mock_page.stub(:must_notify=).with(true)
  #     @mock_page.stub(:deep_notify=).with(false)
  #     @mock_page.stub(:update_attributes).with({})
  #     @mock_page.stub(:update_attributes!).with({})
  #     @mock_page.stub(:reload)
  #   end
  #
  #   context "accessed by admin" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(true)
  #       @mock_user.stub(:has_role?).with("admin").and_return(true)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
  #       expects :save!, :on => mock_page, :returns => true
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :update_attributes!, :on => mock_page, :with => {}
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :destroy, :on => mock_page
  #       should_respond_with :success, :content_type => :json
  #     end
  #   end
  #
  #   context "accessed by editor" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(true)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :new, :on => Page, :with => { "uuid" => "uuid" }, :returns => mock_page
  #       expects :save!, :on => mock_page, :returns => true
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :update_attributes!, :on => mock_page, :with => {}
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid, :on => Page, :with => "uuid", :returns => mock_page
  #       expects :destroy, :on => mock_page
  #       should_respond_with :success, :content_type => :json
  #     end
  #   end
  #
  #   context "accessed by reader" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(true)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => []
  #       should_respond_with :success, :content_type => :json
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       expects :pages, :on => mock_document, :returns => Page
  #       expects :find_by_uuid_or_position!, :on => Page, :with => "uuid", :returns => mock_page
  #       should_respond_with :success, :content_type => :html
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #   end
  #
  #   context "accessed by user" do
  #     before(:each) do
  #       @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #       @mock_user.stub(:has_role?).with("admin", nil).and_return(false)
  #       @mock_user.stub(:has_role?).with("admin").and_return(false)
  #       @mock_user.stub(:has_role?).with("editor", mock_document).and_return(false)
  #       @mock_user.stub(:has_role?).with("reader", mock_document).and_return(false)
  #       User.stub(:find).and_return(@mock_user)
  #       sign_in :user, @mock_user
  #     end
  #
  #     describe :get => :index, :document_id => "1" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
  #       expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
  #       should_respond_with :not_found
  #     end
  #   end
  #
  #   context "accessed by anonymous" do
  #
  #     describe :get => :index, :document_id => "1" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :get => :show, :document_id => "1", :id => "uuid" do
# #        expects :find_by_uuid, :on => Document, :with => "1", :returns => mock_document
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :post => :create, :document_id => "1", :page => { :uuid => "uuid" } do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :put => :update, :document_id => "1", :id => "uuid", :page => {} do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #     describe :delete => :destroy, :document_id => "1", :id => "uuid" do
# #        should_respond_with :not_found
  #       should_redirect_to('http://test.host/users/sign_in?unauthenticated=true')
  #     end
  #   end
  # end
