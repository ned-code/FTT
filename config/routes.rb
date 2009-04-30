ActionController::Routing::Routes.draw do |map|
  map.resource :session

  map.resources :users, :member => {:confirm => :get}
  map.resources :documents
  map.connect 'document/:uuid',
    :controller => 'documents', :action => 'show',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :get }
  map.connect 'document/:uuid',
    :controller => 'documents', :action => 'update',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :put }
  map.connect 'document/:uuid',
    :controller => 'documents', :action => 'destroy',
    :uuid => UUID_FORMAT_REGEX,
    :conditions => { :method => :delete }

  map.connect 'documents/delete_all',
    :controller => 'documents', :action => 'destroy_all',
    :conditions => { :method => :get }

  map.root :controller => 'sessions', :action => 'new'
end
