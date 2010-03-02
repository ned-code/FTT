require 'spec_helper'

describe Admin::WidgetsController do
  
  should_route :get,    '/admin/apps',        :action => :index
  should_route :get,    '/admin/apps/new',    :action => :new
  should_route :post,   '/admin/apps',        :action => :create
  should_route :delete, '/admin/apps/1',      :action => :destroy,  :id => 1
  should_route :get,    '/admin/apps/1/edit', :action => :edit,     :id => 1
  should_route :put,    '/admin/apps/1',      :action => :update,   :id => 1
  
end
