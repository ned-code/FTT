require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe SessionsController do

  it('') { should route :get,     '/session/new', :controller => :sessions, :action => :new     }
  it('') { should route :post,    '/session',     :controller => :sessions, :action => :create  }
  it('') { should route :delete,  '/session',     :controller => :sessions, :action => :destroy }

end
