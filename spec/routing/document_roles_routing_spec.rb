require 'spec_helper'

describe DocumentRolesController do
  
  should_route :get,    '/documents/1/document_roles',    :action => :show, :document_id => 1
  should_route :post,   '/documents/1/document_roles',    :action => :create, :document_id => 1
  should_route :delete, '/documents/1/document_roles',    :action => :destroy,  :document_id => 1
  should_route :put,    '/documents/1/document_roles',    :action => :update,   :document_id => 1
  
end