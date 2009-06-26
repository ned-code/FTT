require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe MediasController do

  it { should route( :get,    '/medias',   :controller => :medias, :action => :index             )}
  it { should route( :post,   '/medias',   :controller => :medias, :action => :create            )}
  it { should route( :get,    '/medias/1', :controller => :medias, :action => :show,    :id => 1 )}
  it { should route( :put,    '/medias/1', :controller => :medias, :action => :update,  :id => 1 )}
  it { should route( :delete, '/medias/1', :controller => :medias, :action => :destroy, :id => 1 )}

end
