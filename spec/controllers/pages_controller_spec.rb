require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PagesController do
  integrate_views

  before(:each) do
    activate_authlogic
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
