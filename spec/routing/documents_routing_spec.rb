require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe DocumentsController do
  
  should_route :get,     '/documents',        :action => :index
  should_route :get,     '/documents.json',   :action => :index,   :format => :json
  should_route :get,     '/documents/1',      :action => :show,    :id => 1
  should_route :get,     '/documents/1/edit', :action => :edit,    :id => 1
  should_route :post,    '/documents',        :action => :create
  should_route :put,     '/documents/1',      :action => :update,  :id => 1
  should_route :delete,  '/documents/1',      :action => :destroy, :id => 1
  
end
