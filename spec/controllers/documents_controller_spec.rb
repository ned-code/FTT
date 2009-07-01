
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
          get :index

          response.should be_success
          response.should respond_with(:content_type => :html)

          response.should_not have_tag("#document_#{@document.id}")
        end

      end

      context 'with associated document' do

        before(:each) do

          @document = full_doc[:document]
          @document.accepts_role 'owner', @current_user

          @document_deleted = full_doc('11111111-1234-1234-1234-123456789123')[:document]
          @document_deleted.accepts_role 'owner', @current_user
          @document_deleted.destroy

          @document_not_owned = full_doc('22222222-1234-1234-1234-123456789123')[:document]
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should render list of documents owned by current user without deleted documents" do
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
        transaction_path = 'synctran-acti-onit-em00-0000000000000.txt'

        request.env['UB_CLIENT_UUID'] = @client_uuid

        File.open(fixture_file(transaction_path)) do |file|
          request.env['rack.input'] << file.read
        end
        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env['UB_SYNC_CONTENT_TYPE'] = 'text/plain'
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        post :push, :id => UUID.generate

        response.should be_success
        response.should respond_with(:content_type => :xml)

        item = assigns(:transaction).items.find_by_path(transaction_path)
        item.should_not be_nil
        item.path.should == request.env['UB_SYNC_FILENAME']
        item.content_type.should == request.env['UB_SYNC_CONTENT_TYPE']
        item.part_nb.should == request.env['UB_SYNC_PART_NB']
        item.part_total_nb.should == request.env['UB_SYNC_PART_TOTAL_NB']
        item.part_check_sum.should == request.env['UB_SYNC_PART_CHECK_SUM']
        item.item_check_sum.should == request.env['UB_SYNC_ITEM_CHECK_SUM']

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          assigns(:transaction).uuid,
          @client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should create transaction with empty file data in request" do
        transaction_path = 'synctran-acti-onit-em00-0000000000000.txt'

        request.env['UB_CLIENT_UUID'] = @client_uuid

        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env['UB_SYNC_CONTENT_TYPE'] = 'text/plain'
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest

        post :push, :id => UUID.generate

        response.should be_success
        response.should respond_with(:content_type => :xml)

        item = assigns(:transaction).items.find_by_path(transaction_path)
        item.should_not be_nil
        item.path.should == request.env['UB_SYNC_FILENAME']
        item.content_type.should == request.env['UB_SYNC_CONTENT_TYPE']
        item.part_nb.should == request.env['UB_SYNC_PART_NB']
        item.part_total_nb.should == request.env['UB_SYNC_PART_TOTAL_NB']
        item.part_check_sum.should == request.env['UB_SYNC_PART_CHECK_SUM']
        item.item_check_sum.should == request.env['UB_SYNC_ITEM_CHECK_SUM']

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          assigns(:transaction).uuid,
          @client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should continue transaction with file data in request" do
        transaction_path = 'synctran-acti-onit-em00-0000000000000.txt'

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        File.open(fixture_file(transaction_path)) do |file|
          request.env['rack.input'] << file.read
        end
        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env['UB_SYNC_CONTENT_TYPE'] = 'text/plain'
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        item = assigns(:transaction).items.find_by_path(transaction_path)
        item.should_not be_nil
        item.path.should == request.env['UB_SYNC_FILENAME']
        item.content_type.should == request.env['UB_SYNC_CONTENT_TYPE']
        item.part_nb.should == request.env['UB_SYNC_PART_NB']
        item.part_total_nb.should == request.env['UB_SYNC_PART_TOTAL_NB']
        item.part_check_sum.should == request.env['UB_SYNC_PART_CHECK_SUM']
        item.item_check_sum.should == request.env['UB_SYNC_ITEM_CHECK_SUM']

        response.should_not have_tag('errors')
        response.should have_tag('transaction[uuid=?][client_uuid=?][created-at=?][updated-at=?]',
          @transaction.uuid,
          @transaction.ub_client_uuid,
          assigns(:transaction).created_at.xmlschema,
          assigns(:transaction).updated_at.xmlschema
        )
      end

      it "'POST /documents/:uuid/push' should update transaction with empty file data in request" do
        transaction_path = 'synctran-acti-onit-em00-0000000000000.txt'

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        request.env['UB_SYNC_FILENAME'] = transaction_path
        request.env['UB_SYNC_CONTENT_TYPE'] = 'text/plain'
        request.env["UB_SYNC_PART_NB"] = 1
        request.env["UB_SYNC_PART_TOTAL_NB"] = 1
        request.env["UB_SYNC_PART_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest
        request.env["UB_SYNC_ITEM_CHECK_SUM"] = Digest::MD5.file(request.env['rack.input'].path).hexdigest

        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)

        item = assigns(:transaction).items.find_by_path(transaction_path)
        item.should_not be_nil
        item.path.should == request.env['UB_SYNC_FILENAME']
        item.content_type.should == request.env['UB_SYNC_CONTENT_TYPE']
        item.part_nb.should == request.env['UB_SYNC_PART_NB']
        item.part_total_nb.should == request.env['UB_SYNC_PART_TOTAL_NB']
        item.part_check_sum.should == request.env['UB_SYNC_PART_CHECK_SUM']
        item.item_check_sum.should == request.env['UB_SYNC_ITEM_CHECK_SUM']

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
        @transaction = Factory.create(:ub_sync_transaction_complete, :user => @current_user)
        fixture_ubz(:valid).each do |path|
          @transaction.items.create!(
            :path => path.gsub(/.*?#{UUID_FORMAT_REGEX}\//, ''),
            :content_type => get_content_type_from_filename(path) || "application/octet+stream",
            :data => File.open(path),
            :part_nb => 1,
            :part_total_nb => 1,
            :part_check_sum => Digest::MD5.file(path).hexdigest,
            :item_check_sum => Digest::MD5.file(path).hexdigest,
            :storage_config => {:name => :filesystem}
          )
        end

        request.env['UB_SYNC_TRANSACTION_UUID'] = @transaction.uuid
        request.env['UB_CLIENT_UUID'] = @transaction.ub_client_uuid

        request.env['UB_SYNC_ACTION'] = 'commit'

        post :push, :id => @transaction.ub_document_uuid

        response.should be_success
        response.should respond_with(:content_type => :xml)
      end

      context 'without associated document' do

        it "'GET /documents' should return an empty list" do
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
          @document_full_hash = full_doc
          @document = @document_full_hash[:document]
          @document.accepts_role 'owner', @current_user
          @document_deleted = Factory.create(:ub_document)
          @document_deleted.accepts_role 'owner', @current_user
          @document_deleted.destroy
          @document_not_owned = Factory.create(:ub_document)
          @document_not_owned.accepts_role 'owner', Factory.create(:user)
        end

        it "'GET /documents' should return list of documents owned by current user with deleted documents" do
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
              with_tag('media[uuid=?][version=?][created-at=?][updated-at=?]',
                page.media.uuid,
                page.media.version,
                page.media.created_at.xmlschema,
                page.media.updated_at.xmlschema
              )
            end
          end
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' if current user is not the owner" do
          get :show, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' id document is deleted" do
          get :show, :id => @document_deleted.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'GET /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          get :show, :id => UUID.generate

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should delete document" do
          delete :destroy, :id => @document.uuid

          response.should be_success
          response.should respond_with(:content_type => :xml)

          response.should_not have_tag('errors')

          UbDocument.find_by_id(@document.id).should be_nil
          UbDocument.find_by_id(@document.id, :with_deleted => true).should_not be_nil
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if current user is not the owner" do
          delete :destroy, :id => @document_not_owned.uuid

          response.should be_forbidden
          response.should respond_with(:content_type => :xml)
        end

        it "'DELETE /documents/:uuid' should return status '403 Forbidden' if document does not exist" do
          delete :destroy, :id => UUID.generate

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
        get :index

        response.should be_unauthorized
        response.should respond_with(:content_type => :xml)
      end

      it "'GET /documents/:uuid' should return status '401 Unauthorized'" do
        get :show, :id => @document.uuid

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
