require 'spec_helper'

describe ConnectionsController do
  
  should_route :get,    '/connections/followers', :controller => 'connections', :action => :followers
  should_route :get,    '/connections/following', :controller => 'connections', :action => :following
  should_route :post,   '/connections', :controller => 'connections', :action => :create
  should_route :delete, '/connections', :controller => 'connections', :action => :destroy
  
end
