require 'spec_helper'

describe DatastoreEntriesController do
  
  should_route :get,     '/items/1/datastore_entries',      :action => :index, :item_id => 1
  should_route :get,     '/items/1/datastore_entries/1',    :action => :show, :item_id => 1,    :id => 1
  should_route :post,    '/items/1/datastore_entries',      :action => :create, :item_id => 1
  should_route :delete,  '/items/1/datastore_entries/1',    :action => :destroy, :item_id => 1, :id => 1
  should_route :delete,  '/items/1/datastore_entries',      :action => :destroy_all, :item_id => 1
  
end
