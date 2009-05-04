require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
  integrate_views

  before(:each) do
    activate_authlogic
    @current_user = Factory.create(:confirmed_user)
    @current_user.is_registered
    UserSession.create(@current_user)
  end

  describe 'API' do

    before(:each) do
      request.env['HTTP_ACCEPT'] = 'application/xml'
    end

    context 'accessed by a registered user' do

      it "'POST /documents' with valid payload should create document" do
        mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should be_success
        response.should_not have_tag('errors')
        response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]', assigns(:document).uuid, assigns(:document).version, assigns(:document).created_at.xmlschema, assigns(:document).updated_at.xmlschema) do
          assigns(:document).pages.each do |page|
            with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]', page.uuid, page.version, page.created_at.xmlschema, page.updated_at.xmlschema)
          end
        end
        assigns[:document].accepts_role?('owner', @current_user).should be_true
      end

      it "'POST /documents' without valid paylod should not create documents" do
        mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should_not be_success
        response.should have_tag('errors') do
          with_tag('error', 'File has invalid format')
        end
        response.should_not have_tag('document')
        assigns[:document].accepts_role?('owner', @current_user).should_not be_true
      end

      it "'POST /documents' with payload without valid UUID should not create document" do
        mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should_not be_success
        response.should have_tag('errors') do
          with_tag('error', 'Uuid is invalid')
        end
        response.should_not have_tag('document')
        assigns[:document].accepts_role?('owner', @current_user).should_not be_true
      end

      context 'without associated document' do

        it "'GET /documents' should return an empty list" do
          documents = []
          documents << Factory.create(:uniboard_document)
          documents << Factory.create(:uniboard_document)
          documents << Factory.create(:uniboard_document)
          documents << Factory.create(:uniboard_document)

          get :index

          response.should be_success
          response.should have_tag('documents[synchronised-at=?]', assigns[:synchronised_at].xmlschema) do
            without_tag('document')
          end
        end

      end

      context 'with associated document' do

        before(:each) do
          @document = Factory.create(:uniboard_document)
          @document.accepts_role 'owner', @current_user

          @document_deleted = Factory.create(:uniboard_document)
          @document_deleted.accepts_role 'owner', @current_user
          @document_deleted.destroy

          @document_not_owned = Factory.create(:uniboard_document)
        end

        it "'GET /documents' should should return list of documents owned by current user with deleted documents" do
          get :index

          response.should be_success
          response.should have_tag('documents[synchronised-at=?]', assigns[:synchronised_at].xmlschema) do
            with_tag('document[uuid=?][version=?][created-at=?][updated-at=?][deleted=?]', @document.uuid, @document.version, @document.created_at.xmlschema, @document.updated_at.xmlschema, 'false')
            with_tag('document[uuid=?][version=?][created-at=?][updated-at=?][deleted=?]', @document_deleted.uuid, @document_deleted.version, @document_deleted.created_at.xmlschema, @document_deleted.updated_at.xmlschema, 'true')
            without_tag('document[uuid=?][version=?][created-at=?][updated-at=?]', @document_not_owned.uuid, @document_not_owned.version, @document_not_owned.created_at.xmlschema, @document_not_owned.updated_at.xmlschema)
          end
        end

        it "'GET /documents/:uuid' on a owned document should return XML description of document" do
          get :show, :id => @document.uuid

          response.should be_success
          response.should_not have_tag('errors')
          response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]', assigns(:document).uuid, assigns(:document).version, assigns(:document).created_at.xmlschema, assigns(:document).updated_at.xmlschema) do
            @document.pages.each do |page|
              with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]', page.uuid, page.version, page.created_at.xmlschema, page.updated_at.xmlschema, /^http/)
            end
          end
        end

        it "'GET /documents/:uuid' on a not owned document should return 'access denied" do
          get :show, :id => @document_not_owned.uuid

          response.should be_forbidden
        end

        it "'GET /documents/:uuid' on a deleted docuement should return 'access denied'" do
          @document.destroy

          get :show, :id => @document.uuid

          response.should be_forbidden
        end

        it "'DELETE /documents/:uuid' on a owned document should delete document" do
          delete :destroy, :id => @document.uuid

          response.should be_success
          response.should_not have_tag('errors')
        end

        it "'DELETE /documents/:uuid' on a not owned document should return 'access denied" do
          delete :destroy, :id => @document_not_owned.uuid

          response.should be_forbidden
        end

        it "'PUT /documents/:uuid' with valid payload should update document" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document.uuid)

          post :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should be_success
          response.should_not have_tag('errors')
          response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]', assigns(:document).uuid, assigns(:document).version, assigns(:document).created_at.xmlschema, assigns(:document).updated_at.xmlschema) do
            assigns(:document).pages.each do |page|
              with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]', page.uuid, page.version, page.created_at.xmlschema, page.updated_at.xmlschema)
            end
          end
        end

        it "'PUT /documents/:uuid' on document with upper version on server should not update document" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document.uuid)
          @document.update_attribute(:version, @document.version + 1)

          post :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should have_tag('errors') do
            with_tag('error', 'Version have already changed on server')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' without valid payload should not update document" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

          post :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should have_tag('errors') do
            with_tag('error', 'File has invalid format')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' with payload without valid UUID should not update document" do
          mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

          post :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should have_tag('errors') do
            with_tag('error', 'Uuid is invalid')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' with payload with different UUID should not update document" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

          post :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should have_tag('errors') do
            with_tag('error', 'Uuid have changed')
          end
          response.should_not have_tag('document')
        end

      end
    end
  end
end
