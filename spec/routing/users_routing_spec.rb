require 'spec_helper'

describe UsersController do
  
  should_route :get,     '/users',        :action => :index
  should_route :get,     '/users/1',      :action => :show,    :id => 1
  should_route :get,     '/users/1/edit', :action => :edit,    :id => 1
  should_route :put,     '/users/1',      :action => :update,  :id => 1
  
end