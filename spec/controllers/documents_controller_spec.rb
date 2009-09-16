require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
  mock_models :document
  
  describe :post => :create, :document => {} do
    mime Mime::JSON
    expects :new, :on => Document, :with => {}, :returns => mock_document
    expects :pages, :on => mock_document, :returns => Page 
    expects :build, :on => Page
    expects :save, :on => mock_document, :returns => true
    expects :to_json, :on => mock_document, :returns => {}
    
    should_assign_to :document, :with => mock_document
    should_respond_with :success, :content_type => Mime::JSON
  end
  
end