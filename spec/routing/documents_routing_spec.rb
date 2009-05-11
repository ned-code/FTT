require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do

  before(:all) do
    @uuid = UUID.generate
  end

  it('') { should route( :get,     '/documents',           :controller => :documents, :action => :index                  )}
  it('') { should route( :post,    '/documents',           :controller => :documents, :action => :create                 )}
  it('') { should route( :get,     '/documents/1',         :controller => :documents, :action => :show,    :id => 1      )}
  it('') { should route( :get,     "/documents/#{@uuid}",  :controller => :documents, :action => :show,    :id => @uuid  )}
  it('') { should route( :put,     '/documents/1',         :controller => :documents, :action => :update,  :id => 1      )}
  it('') { should route( :put,     "/documents/#{@uuid}",  :controller => :documents, :action => :update,  :id => @uuid  )}
  it('') { should route( :delete,  '/documents/1',         :controller => :documents, :action => :destroy, :id => 1      )}
  it('') { should route( :delete,  "/documents/#{@uuid}",  :controller => :documents, :action => :destroy, :id => @uuid  )}

end
