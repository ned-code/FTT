require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
  integrate_views

  it "should create document with valid ubz" do
    mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

    post :create, :document => { :file => mock_file }

    response.should be_success
    response.should render_template 'create.xml.erb'
    response.should have_tag('document[id=?]', assigns[:document].id)
    response.should_not have_tag('errors')
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
  end

  it "should list documents" do
    documents = []
    documents << Factory.create(:uniboard_document)
    documents << Factory.create(:uniboard_document)
    documents << Factory.create(:uniboard_document)

    get :index

    response.should be_success
    response.should render_template 'index.xml.erb'
    response.should have_tag('documents') do
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[0].id, documents[0].uuid, documents[0].created_at, documents[0].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[1].id, documents[1].uuid, documents[1].created_at, documents[1].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', documents[2].id, documents[2].uuid, documents[2].created_at, documents[2].updated_at)
    end
  end

  it "should get document" do
    document = Factory.create(:uniboard_document)

    get :show, :id => document.id

    response.should redirect_to(document.url)
    response.should render_template 'show.xml.erb'
    response.should have_tag('document[id=?][location=?]', document.id, document.url)
  end

  it "should delete document" do
    document = Factory.create(:uniboard_document)

    delete :destroy, :id => document.id

    response.should be_success
    response.should render_template 'destroy.xml.erb'
    response.should have_tag('document[id=?]', document.id)
  end

  it "should update document with valid ubz" do
    document = Factory.create(:uniboard_document)
    mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz')

    post :update, :id => document.id , :document => { :file => mock_file }

    response.should be_success
    response.should render_template 'update.xml.erb'
    response.should have_tag('document[id=?]', assigns[:document].id)
    response.should_not have_tag('errors')
  end

  it "should not update document with not valid ubz" do
    document = Factory.create(:uniboard_document)
    mock_file = mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz')

    post :update, :id => document.id , :document => { :file => mock_file }

    response.should_not be_success
    response.should_not render_template 'update.xml.erb'
    response.should have_tag('errors') do
      without_tag('error', 'Uuid is invalid')
      with_tag('error', 'File has invalid format')
    end
  end

  it "should not update document with not valid uuid" do
    document = Factory.create(:uniboard_document)
    mock_file = mock_uploaded_ubz('nouuid-valid.ubz')

    post :update, :id => document.id , :document => { :file => mock_file }

    response.should_not be_success
    response.should_not render_template 'update.xml.erb'
    response.should have_tag('errors') do
      with_tag('error', 'Uuid is invalid')
      without_tag('error', 'File has invalid format')
    end
  end

  it "should not update document with if uuid changed" do
    document = Factory.create(:uniboard_document,
      :file => File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', '00000000-0000-0000-0000-0000000valid.ubz')
    )
    mock_file = mock_uploaded_ubz('10000000-0000-0000-0000-0000000valid.ubz')

    post :update, :id => document.id , :document => { :file => mock_file }

    response.should_not be_success
    response.should_not render_template 'update.xml.erb'
    response.should have_tag('errors') do
      with_tag('error', 'Uuid have changed')
      without_tag('error', 'File has invalid format')
    end
  end
end
