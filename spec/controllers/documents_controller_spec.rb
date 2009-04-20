require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
  integrate_views

  before(:each) do
    activate_authlogic
    @current_user = Factory.create(:confirmed_user)
    @current_user.is_registered
    UserSession.create(@current_user)
  end

  it "should create document with valid ubz" do
    mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

    post :create, :document => { :file => mock_file }

    response.should be_success
    response.should render_template 'create.xml.erb'
    response.should have_tag('document[id=?]', assigns[:document].id)
    response.should_not have_tag('errors')
    assigns[:document].accepts_role?('owner', @current_user).should be_true
  end

  it "should not create document with not valid ubz" do
    mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

    post :create, :document => { :file => mock_file }

    response.should_not be_success
    response.should_not render_template 'create.xml.erb'
    response.should have_tag('errors') do
      without_tag('error', 'Uuid is invalid')
      with_tag('error', 'File has invalid format')
    end
    assigns[:document].accepts_role?('owner', @current_user).should_not be_true
  end

  it "should not create document with not valid uuid" do
    mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

    post :create, :document => { :file => mock_file }

    response.should_not be_success
    response.should_not render_template 'create.xml.erb'
    response.should have_tag('errors') do
      with_tag('error', 'Uuid is invalid')
      without_tag('error', 'File has invalid format')
    end
    assigns[:document].accepts_role?('owner', @current_user).should_not be_true
  end

  it "should list documents owned by current user" do
    documents = []
    documents << Factory.create(:uniboard_document)
    documents << Factory.create(:uniboard_document)
    documents << Factory.create(:uniboard_document)
    documents.each {|d| d.accepts_role 'owner', @current_user}
    documents << Factory.create(:uniboard_document)

    get :index

    response.should be_success
    response.should render_template 'index.xml.erb'
    response.should have_tag('documents') do
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[0].id, documents[0].uuid, documents[0].created_at, documents[0].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[1].id, documents[1].uuid, documents[1].created_at, documents[1].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[2].id, documents[2].uuid, documents[2].created_at, documents[2].updated_at)
      without_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[3].id, documents[3].uuid, documents[3].created_at, documents[3].updated_at)
    end
  end

  context "owned by current user" do

    before(:each) do
      @document = Factory.create(:uniboard_document)
      @document.accepts_role 'owner', @current_user
    end

    it "should get document if current user is owner" do
      get :show, :id => @document.id

      response.should redirect_to(@document.url)
      response.should render_template 'show.xml.erb'
      response.should have_tag('document[id=?][location=?]', @document.id, @document.url)
    end

    it "should delete document" do
      delete :destroy, :id => @document.id

      response.should be_success
      response.should render_template 'destroy.xml.erb'
      response.should have_tag('document[id=?]', @document.id)
    end

    it "should update document with valid ubz" do
      mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz', @document.uuid)

      post :update, :id => @document.id , :document => { :file => mock_file }

      response.should be_success
      response.should render_template 'update.xml.erb'
      response.should have_tag('document[id=?]', assigns[:document].id)
      response.should_not have_tag('errors')
    end

    it "should not update document with not valid ubz" do
      mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

      post :update, :id => @document.id , :document => { :file => mock_file }

      response.should_not be_success
      response.should_not render_template 'update.xml.erb'
      response.should have_tag('errors') do
        without_tag('error', 'Uuid is invalid')
        with_tag('error', 'File has invalid format')
      end
    end

    it "should not update document with not valid uuid" do
      mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

      post :update, :id => @document.id , :document => { :file => mock_file }

      response.should_not be_success
      response.should_not render_template 'update.xml.erb'
      response.should have_tag('errors') do
        with_tag('error', 'Uuid is invalid')
        without_tag('error', 'File has invalid format')
      end
    end

    it "should not update document with if uuid changed" do
      mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

      post :update, :id => @document.id , :document => { :file => mock_file }

      response.should_not be_success
      response.should_not render_template 'update.xml.erb'
      response.should have_tag('errors') do
        with_tag('error', 'Uuid have changed')
        without_tag('error', 'File has invalid format')
      end
    end

  end

  context "not owned by current user" do

    before(:each) do
      @document = Factory.create(:uniboard_document)
      @document.accepts_role 'owner', Factory.create(:user)
    end

    it "should not get document" do
      get :show, :id => @document.id

      response.should_not be_success
      response.should_not render_template 'show.xml.erb'
      response.should be_redirect
    end

    it "should not delete document" do
      delete :destroy, :id => @document.id

      response.should_not be_success
      response.should_not render_template 'destroy.xml.erb'
      response.should be_redirect
    end

    it "should not update document" do
      mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

      post :update, :id => @document.id , :document => { :file => mock_file }

      response.should_not be_success
      response.should_not render_template 'update.xml.erb'
      response.should be_redirect
    end
  end
end
