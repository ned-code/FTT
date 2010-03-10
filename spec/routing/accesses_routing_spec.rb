require 'spec_helper'

describe AccessesController do
  
  should_route :get,    '/documents/1/accesses',    :action => :show, :document_id => 1
  should_route :post,   '/documents/1/accesses',    :action => :create, :document_id => 1
  should_route :delete, '/documents/1/accesses',    :action => :destroy,  :document_id => 1
  should_route :put,    '/documents/1/accesses',    :action => :update,   :document_id => 1
  
end