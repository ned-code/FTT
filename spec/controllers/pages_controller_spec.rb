require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PagesController do
  integrate_views

  before(:each) do
    activate_authlogic
  end

  describe 'Web access' do
    before(:each) do
      request.env['HTTP_ACCEPT'] = '*/*'
    end

    context 'accessed by a registered user' do

      before(:each) do
        @current_user = Factory.create(:confirmed_user)
        @current_user.is_registered
        UserSession.create(@current_user)

        @page = Factory.create(:uniboard_document).pages.first
        @page.document.accepts_role 'owner', @current_user

        @page_deleted = Factory.create(:uniboard_document).pages.first
        @page_deleted.document.accepts_role 'owner', @current_user
        @page_deleted.destroy

        @page_not_owned = Factory.create(:uniboard_document).pages.first
        @page_not_owned.document.accepts_role 'owner', Factory.create(:user)
      end

      it "'GET /documents/:uuid/pages/:uuid' should render" do
        get :show, :document_id => @page.document.id, :id => @page.id

        response.should be_success
        response.should respond_with(:content_type => :html)
      end

      it "'GET /documents/:uuid/pages/:uuid' should render with page navigation" do
        get :show, :document_id => @page.document.id, :id => @page.id

        response.should have_tag('#page_navigation') do
          with_tag('a[href=?]', document_path(@page.document))
          with_tag('a[href=?]', document_page_path(@page.document, @page.next))
        end
      end

      it "'GET /documents/:uuid/pages/:uuid' should render error 404 if current user is not the owner" do
        get :show, :document_id => @page_not_owned.document.id, :id => @page_not_owned.id

        response.should be_not_found
        response.should respond_with(:content_type => :html)
      end

      it "'GET /documents/:uuid/pages/:uuid' should render error 404 id page is deleted" do
        get :show, :document_id => @page_deleted.document.id, :id => @page_deleted.id

        response.should be_not_found
        response.should respond_with(:content_type => :html)
      end

      it "'GET /documents/:uuid/pages/:uuid' should render error 404 if document does not exist" do
        get :show, :document_id => 100_000_000_000, :id => 100_000_000_000

        response.should be_not_found
        response.should respond_with(:content_type => :html)
      end

      it "'GET /documents/:uuid/pages/:uuid' should render 404 if page does not exist" do
        get :show, :document_id => @page.document.id, :id => 100_000_000_000

        response.should be_not_found
        response.should respond_with(:content_type => :html)
      end

      context 'with s3 storage' do

        it "'GET /documents/:uuid/pages/:uuid' should render" do
          get :show, :document_id => @page.document.id, :id => @page.id

          response.should have_tag("#page_#{@page.id}") do
            with_tag('iframe[src=?]', @page.url)
          end
        end

      end
    end
  end

  describe 'XML API' do

    before(:each) do
      request.env['HTTP_ACCEPT'] = 'application/xml'
    end

    context 'accessed by a registered user' do

      before(:each) do
        @current_user = Factory.create(:confirmed_user)
        @current_user.is_registered
        UserSession.create(@current_user)

        @page = Factory.create(:uniboard_page)
        @page.document.accepts_role 'owner', @current_user

        @page_deleted = Factory.create(:uniboard_page)
        @page_deleted.document.accepts_role 'owner', @current_user
        @page_deleted.destroy

        @page_not_owned = Factory.create(:uniboard_page)
        @page_not_owned.document.accepts_role 'owner', Factory.create(:user)
      end

      it "'GET /documents/:uuid/pages/:uuid' should return status '403 Forbidden' if current user is not the owner" do
        get :show, :document_id => @page_not_owned.document.uuid, :id => @page_not_owned.uuid

        response.should be_forbidden
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid/pages/:uuid' should return status '403 Forbidden' id page is deleted" do
        get :show, :document_id => @page_deleted.document.uuid, :id => @page_deleted.uuid

        response.should be_forbidden
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid/pages/:uuid' should return status '403 Forbidden' if document does not exist" do
        get :show, :document_id => UUID.generate, :id => UUID.generate

        response.should be_forbidden
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid/pages/:uuid' should return status '403 Forbidden' if page does not exist" do
        get :show, :document_id => @page.document.uuid, :id => UUID.generate

        response.should be_forbidden
        response.should respond_with(:content_type => :xml)
      end

      context 'with s3 storage' do

        it "'GET /documents/:uuid/pages/:uuid' should be redirect to s3" do
          get :show, :document_id => @page.document.uuid, :id => @page.uuid

          response.should be_redirect
          response.should respond_with(:content_type => :xml)
        end

      end
    end

    context 'accessed by a anonymous user' do

      before(:each) do
        @page = Factory.create(:uniboard_page)
        @page.document.accepts_role 'owner', Factory.create(:user)
      end

      it "'GET /documents/:uuid/pages/:uuid' should return status '401 Unauthorized'" do
        get :show, :document_id => @page.document.uuid, :id => @page.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

    end
  end
end
