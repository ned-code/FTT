require 'spec_helper'

describe Admin::CategoriesController do
  
  should_route :get,    '/admin/categories',        :action => :index
  should_route :get,    '/admin/categories/new',    :action => :new
  should_route :post,   '/admin/categories',        :action => :create
  should_route :delete, '/admin/categories/1',      :action => :destroy,  :id => 1
  should_route :get,    '/admin/categories/1/edit', :action => :edit,     :id => 1
  should_route :put,    '/admin/categories/1',      :action => :update,   :id => 1
  
end
