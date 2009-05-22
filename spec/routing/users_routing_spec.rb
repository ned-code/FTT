require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsersController do

  it('') { should route( :get,     '/users',           :controller => :users, :action => :index             )}
  it('') { should route( :get,     '/users/new',       :controller => :users, :action => :new               )}
  it('') { should route( :post,    '/users',           :controller => :users, :action => :create            )}
  it('') { should route( :get,     '/users/1',         :controller => :users, :action => :show,    :id => 1 )}
  it('') { should route( :get,     '/users/1/edit',    :controller => :users, :action => :edit,    :id => 1 )}
  it('') { should route( :put,     '/users/1',         :controller => :users, :action => :update,  :id => 1 )}
  it('') { should route( :delete,  '/users/1',         :controller => :users, :action => :destroy, :id => 1 )}
  it('') { should route( :get,     '/users/1/confirm', :controller => :users, :action => :confirm, :id => 1 )}
  it('') { should route( :get,     '/users/1/change_password', :controller => :users, :action => :change_password, :id => 1 )}

end
