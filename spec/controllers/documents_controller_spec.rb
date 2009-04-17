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
    docs = []
    docs << Factory.create(:uniboard_document)
    docs << Factory.create(:uniboard_document)
    docs << Factory.create(:uniboard_document)

    get :index

    response.should be_success
    response.should render_template 'index.xml.erb'
    response.should have_tag('documents') do
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', docs[0].id, docs[0].uuid, docs[0].created_at, docs[0].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', docs[1].id, docs[1].uuid, docs[1].created_at, docs[1].updated_at)
      with_tag('document[id=?][uuid=?][created_at=?][updated_at=?]', docs[2].id, docs[2].uuid, docs[2].created_at, docs[2].updated_at)
    end
  end

  it "should get document" do
    doc = Factory.create(:uniboard_document)

    get :show, :id => doc.id

    response.should redirect_to(doc.url)
    response.should render_template 'show.xml.erb'
    response.should have_tag('document[id=?][location=?]', doc.id, doc.url)
  end

  it "should delete document" do
    doc = Factory.create(:uniboard_document)

    delete :destroy, :id => doc.id

    response.should be_success
    response.should render_template 'destroy.xml.erb'
    response.should have_tag('document[id=?]', doc.id)
  end

end
