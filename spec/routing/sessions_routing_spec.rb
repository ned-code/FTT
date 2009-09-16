require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserSessionsController do

  should_route :get,    '/login',         :action => :new
  should_route :post,   '/user_sessions', :action => :create
  should_route :get,    '/logout',        :action => :destroy

end
