require 'spec_helper'

describe PagesController do

  should_route :get,    '/documents/1/pages',   :action => :index,   :document_id => 1
  should_route :get,    '/documents/1/pages/1', :action => :show,    :document_id => 1, :id => 1
  should_route :post,   '/documents/1/pages',   :action => :create,  :document_id => 1
  should_route :put,    '/documents/1/pages/1', :action => :update,  :document_id => 1, :id => 1
  should_route :delete, '/documents/1/pages/1', :action => :destroy, :document_id => 1, :id => 1
  
end