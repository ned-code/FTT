ActionController::Routing::Routes.draw do |map|
  map.resource :session
  map.resource :time

  map.resources :users, :member => {:confirm => :get}

  map.connect 'documents/delete_all',
    :controller => 'documents', :action => 'destroy_all',
    :conditions => { :method => :get }

  map.resources :documents
  map.connect 'documents/:uuid',
    :controller => 'documents', :action => 'show',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :get }
  map.connect 'documents/:uuid',
    :controller => 'documents', :action => 'update',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :put }
  map.connect 'documents/:uuid',
    :controller => 'documents', :action => 'destroy',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :delete }

  map.root :controller => 'sessions', :action => 'new'
end
