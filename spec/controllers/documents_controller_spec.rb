
require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
#
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
          @document = Factory.create(:ub_document)
          @document.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should render empty list" do
          pending
          get :index

          response.should be_success
          response.should respond_with(:content_type => :html)

          response.should_not have_tag("#document_#{@document.id}")
        end

      end

      context 'with associated document' do

        before(:each) do
          @document = Factory.create(:ub_document)
          @document.accepts_role 'owner', @current_user

          @document_deleted = Factory.create(:ub_document)
          @document_deleted.accepts_role 'owner', @current_user
          @document_deleted.destroy

          @document_not_owned = Factory.create(:ub_document)
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should render list of documents owned by current user without deleted documents" do
          pending
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
          pending
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
          pending
          get :show, :id => @document_not_owned.id

          response.should be_not_found
          response.should respond_with(:content_type => :html)
        end

        it "'GET /documents/:uuid' should render error 404 id document is deleted" do
          pending
          get :show, :id => @document_deleted.id

          response.should be_not_found
          response.should respond_with(:content_type => :html)
        end

        it "'GET /documents/:uuid' should render error 404 if document does not exist" do
          pending
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
      request.env['rack.input'] = Tempfile.new('tmp-transaction-file')
    end

    context 'accessed by a registered user' do

      before(:each) do
        @current_user = Factory.create(:confirmed_user)
        @current_user.is_registered
        UserSession.create(@current_user)

        @another_user = Factory.create(:confirmed_user)
        @another_user.is_registered

        @transaction = Factory.create(:ub_sync_transaction, :user => @current_user)
        @client_uuid = UUID.generate
      end

      it "'POST /documents/:uuid/push' should create transaction if request don't have transaction UUID" do
        request.env['UB_CLIENT_UUID'] = @client_uuid
        post :push, :id => UUID.generate

        response.should be_success
        response.should respond_with(:content_type => :xml)

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          assigns(:transaction).uuid,
          @client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should update transaction if request have transaction UUID" do
        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid
        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          @transaction.uuid,
          @transaction.ub_client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should return error if request have non-existent transaction UUID" do
        request.env['UB_SYNC_TRANSACTION_UUID'] = UUID.generate
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid
        post :push, :id => UUID.generate

        response.should be_not_found
        response.should respond_with(:content_type => :xml)
      end

      it "'POST /documents/:uuid/push' should return error if a transaction already exist for document" do
        @another_transaction = Factory.create(:ub_sync_transaction, :user => @another_user)
        request.env['UB_CLIENT_UUID'] = UUID.generate
        post :push, :id => @another_transaction.ub_document_uuid

        response.should_not be_success
        response.should respond_with(:content_type => :xml)

        response.should have_tag('errors') do
          with_tag('error', 'Ub document uuid already have open transaction')
        end
      end

      it "'POST /documents/:uuid/push' should create transaction with file data in request" do
        transaction_path = 'sync-transaction-item.txt'

        request.env['UB_CLIENT_UUID'] = @client_uuid

        File.open(fixture_file(transaction_path)) do |file|
          request.env['rack.input'] << file.read
        end
        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        post :push, :id => UUID.generate

        response.should be_success
        response.should respond_with(:content_type => :xml)

        assigns(:transaction).items.find_by_path(transaction_path).should_not be_nil

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          assigns(:transaction).uuid,
          @client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should create transaction with empty file data in request" do
        transaction_path = 'sync-transaction-item.txt'

        request.env['UB_CLIENT_UUID'] = @client_uuid

        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest

        post :push, :id => UUID.generate

        response.should be_success
        response.should respond_with(:content_type => :xml)

        assigns(:transaction).items.find_by_path(transaction_path).should_not be_nil

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          assigns(:transaction).uuid,
          @client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should continue transaction with file data in request" do
        transaction_path = 'sync-transaction-item.txt'

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        File.open(fixture_file(transaction_path)) do |file|
          request.env['rack.input'] << file.read
        end
        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        assigns(:transaction).items.find_by_path(transaction_path).should_not be_nil

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          @transaction.uuid,
          @transaction.ub_client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should update transaction with empty file data in request" do
        transaction_path = 'sync-transaction-item.txt'

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest

        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        assigns(:transaction).items.find_by_path(transaction_path).should_not be_nil

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          @transaction.uuid,
          @transaction.ub_client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should rollback transaction" do
        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        request.env['UB_SYNC_ACTION'] = 'rollback'

        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        lambda { UbSyncTransaction.find(@transaction.id) }.should raise_error(ActiveRecord::RecordNotFound)
      end

      it "'POST /documents/:uuid/push' should commit complete transaction" do
        pending
        @transaction = Factory.create(:ub_sync_transaction_complete, :user => @current_user)

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        request.env['UB_SYNC_ACTION'] = 'commit'

        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)
      end

      context 'without associated document' do

        it "'GET /documents' should return an empty list" do
          pending
          documents = []
          documents << Factory.create(:ub_document)
          documents << Factory.create(:ub_document)
          documents << Factory.create(:ub_document)
          documents << Factory.create(:ub_document)

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
          @document = Factory.create(:ub_document)
          @document.accepts_role 'owner', @current_user

          @document_deleted = Factory.create(:ub_document)
          @document_deleted.accepts_role 'owner', @current_user
          @document_deleted.destroy

          @document_not_owned = Factory.create(:ub_document)
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should return list of documents owned by current user with deleted documents" do
          pending
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
          pending
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

        it "'GET /documents/:uuid' should return status '403 Forbidden' if current user is not the owner" do
          pending
          get :show, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' id document is deleted" do
          pending
          get :show, :id => @document_deleted.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          pending
          get :show, :id => UUID.generate

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'PUT /documents/:uuid' should update document with valid payload" do
          pending
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

        it "'PUT /documents/:uuid' should not update document if payload version is not equal to document version on server" do
          pending
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
          pending
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Payload has invalid format')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should not update document with payload without valid UUID" do
          pending
          mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Uuid is invalid')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should not update document with payload with different UUID" do
          pending
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

          put :update, :id => @document.uuid, :document => { :payload => mock_file }

          response.should_not be_success
          response.should respond_with(:content_type => :xml)

          response.should have_tag('errors') do
            with_tag('error', 'Uuid have changed')
          end
          response.should_not have_tag('document')
        end

        it "'PUT /documents/:uuid' should return status '403 Forbidden' if current user is not the owner" do
          pending
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document_not_owned.uuid)

          put :update, :id => @document_not_owned.uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'PUT /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          pending
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

          put :update, :id => mock_file.uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should delete document" do
          pending
          delete :destroy, :id => @document.uuid

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should_not have_tag('errors')

          UbDocument.find_by_id(@document.id).should be_nil
          UbDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if current user is not the owner" do
          pending
          delete :destroy, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          pending
          mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

          delete :destroy, :id => mock_file.uuid, :document => { :payload => mock_file }

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

      end
    end

    context 'accessed by a anonymous user' do

      before(:each) do
        @document = Factory.create(:ub_document)
        @document.accepts_role 'owner', Factory.create(:user)
      end

      it "'GET /documents' should return status '401 Unauthorized'" do
        pending
        get :index

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'POST /documents' should return status '401 Unauthorized'" do
        pending
        post :create

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid' should return status '401 Unauthorized'" do
        pending
        get :show, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'PUT /documents/:uuid' should return status '401 Unauthorized'" do
        pending
        put :update, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'DELETE /documents/:uuid' should return status '401 Unauthorized'" do
        pending
        delete :destroy, :id => @document.uuid

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

    end
  end
end
