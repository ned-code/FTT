require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
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
      end

      context 'without associated document' do

        before(:each) do
          @document = Factory.create(:uniboard_document)
          @document.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should render empty list" do
          get :index

          response.should be_success
          response.should respond_with(:content_type => :html)

          response.should_not have_tag("#document_#{@document.id}")
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
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should render list of documents owned by current user
            without deleted documents" do
          get :index

          response.should be_success
          response.should respond_with(:content_type => :html)

          response.should have_tag("#document_#{@document.id} a[href=?]",
            document_path(@document)
          ) do
            with_tag('img[src=?]', @document.pages.first.thumbnail_url)
          end
          response.should_not have_tag("#document_#{@document_deleted.id}")
          response.should_not have_tag("#document_#{@document_not_owned.id}")
        end

        it "'GET /documents/:uuid' should render list of document pages" do
          get :show, :id => @document.id

          response.should be_success
          response.should respond_with(:content_type => :html)

          response.should have_tag("#document_#{@document.id}")
          @document.pages do |page|
            response.should have_tag("#page_#{page.id} a[href=?]",
              document_page_path(page.document, page)
            ) do
              with_tag('img[src=?][id=12345]', page.thumbnail_url)
            end
          end
        end

        it "'GET /documents/:uuid' should render error 404 if current user is not the owner" do
          get :show, :id => @document_not_owned.id

          response.should be_not_found
          response.should respond_with(:content_type => :html)
        end

        it "'GET /documents/:uuid' should render error 404 id document is deleted" do
          get :show, :id => @document_deleted.id

          response.should be_not_found
          response.should respond_with(:content_type => :html)
        end

        it "'GET /documents/:uuid' should render error 404 if document does not exist" do
          get :show, :id => 100_000_000_000

          response.should be_not_found
          response.should respond_with(:content_type => :html)
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
      end

      it "'POST /documents' should create document with valid payload" do
        mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should be_success
        response.should respond_with(:content_type => :xml)

        response.should_not have_tag('errors')
        response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]',
          assigns(:document).uuid,
          assigns(:document).version,
          assigns(:document).created_at.xmlschema,
          assigns(:document).updated_at.xmlschema
        ) do
          assigns(:document).pages.each do |page|
            with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]',
              page.uuid,
              page.version,
              page.created_at.xmlschema,
              page.updated_at.xmlschema
            )
          end
        end

        assigns[:document].accepts_role?('owner', @current_user).should be_true
      end

      it "'POST /documents' should not create documents without valid paylod" do
        mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should_not be_success
        response.should respond_with(:content_type => :xml)

        response.should have_tag('errors') do
          with_tag('error', 'Payload has invalid format')
        end
        response.should_not have_tag('document')

        assigns[:document].accepts_role?('owner', @current_user).should_not be_true
      end

      it "'POST /documents' should not create document with payload without valid UUID" do
        mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

        post :create, :document => { :payload => mock_file }

        response.should_not be_success
        response.should respond_with(:content_type => :xml)

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
          response.should respond_with(:content_type => :xml)

          response.should have_tag('documents[synchronised-at=?]',
            assigns[:synchronised_at].xmlschema
          ) do
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
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should return list of documents owned by current user
            with deleted documents" do
          get :index

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('documents[synchronised-at=?]',
            assigns[:synchronised_at].xmlschema
          ) do
            with_tag('document[uuid=?][version=?][created-at=?][updated-at=?][deleted=?]',
              @document.uuid,
              @document.version,
              @document.created_at.xmlschema,
              @document.updated_at.xmlschema,
              'false'
            )
            with_tag('document[uuid=?][version=?][created-at=?][updated-at=?][deleted=?]',
              @document_deleted.uuid,
              @document_deleted.version,
              @document_deleted.created_at.xmlschema,
              @document_deleted.updated_at.xmlschema,
              'true'
            )
            without_tag('document[uuid=?][version=?][created-at=?][updated-at=?]',
              @document_not_owned.uuid,
              @document_not_owned.version,
              @document_not_owned.created_at.xmlschema,
              @document_not_owned.updated_at.xmlschema
            )
          end
        end

        it "'GET /documents/:uuid' should return XML description of document" do
          get :show, :id => @document.uuid

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should_not have_tag('errors')
          response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]',
            assigns(:document).uuid,
            assigns(:document).version,
            assigns(:document).created_at.xmlschema,
            assigns(:document).updated_at.xmlschema
          ) do
            @document.pages.each do |page|
              with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]',
                page.uuid,
                page.version,
                page.created_at.xmlschema,
                page.updated_at.xmlschema
              )
            end
          end
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' if current user
            is not the owner" do
          get :show, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' id document
            is deleted" do
          get :show, :id => @document_deleted.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' if document
            does not exist" do
          get :show, :id => UUID.generate

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'PUT /documents/:uuid' should update document with valid payload" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document.uuid)

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should_not have_tag('errors')
          response.should have_tag('document[uuid=?][version=?][created-at=?][updated-at=?]',
            assigns(:document).uuid,
            assigns(:document).version,
            assigns(:document).created_at.xmlschema,
            assigns(:document).updated_at.xmlschema
          ) do
            assigns(:document).pages.each do |page|
              with_tag('page[uuid=?][version=?][created-at=?][updated-at=?]',
                page.uuid,
                page.version,
                page.created_at.xmlschema,
                page.updated_at.xmlschema
              )
            end
          end
        end

        it "'PUT /documents/:uuid' should not update document if payload version
            is not equal to document version on server" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document.uuid)
          @document.update_attribute(:version, @document.version + 1)

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Version have already changed on server')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should not update document without valid payload" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Payload has invalid format')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should not update document with payload without
            valid UUID" do
          mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Uuid is invalid')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should not update document with payload with
            different UUID" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Uuid have changed')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should return status '403 Forbidden' if current
            user is not the owner" do
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document_not_owned.uuid)

          put :update, :id => @document_not_owned.uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'PUT /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          uuid = UUID.generate
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', uuid)

          put :update, :id => uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should delete document" do
          delete :destroy, :id => @document.uuid

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should_not have_tag('errors')

          UniboardDocument.find_by_id(@document.id).should be_nil
          UniboardDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if current
            user is not the owner" do
          delete :destroy, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if document
            does not exist" do
          uuid = UUID.generate
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', uuid)

          delete :destroy, :id => uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

      end
    end

    context 'accessed by a anonymous user' do

      before(:each) do
        @document = Factory.create(:uniboard_document)
        @document.accepts_role 'owner', Factory.create(:user)
      end

      it "'GET /documents' should return status '401 Unauthorized'" do
        get :index

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'POST /documents' should return status '401 Unauthorized'" do
        post :create

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid' should return status '401 Unauthorized'" do
        get :show, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'PUT /documents/:uuid' should return status '401 Unauthorized'" do
        put :update, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'DELETE /documents/:uuid' should return status '401 Unauthorized'" do
        delete :destroy, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

    end
  end
end
