ActionController::Routing::Routes.draw do |map|
  Jammit::Routes.draw(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.connect 'proxy/get', :controller => 'proxy', :action => 'get', :conditions => { :method => :get }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items } do |m|
    m.resource :accesses, :only => [:show, :create, :update]
    m.resource :creators, :only => [:show]
  end
  
  map.resources :datastores, :only => [:show] do |datastore|
    datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  end
  
  map.devise_for :users
  map.resources :users, :except => [:new, :create, :destroy]
  map.connect 'user', :controller => 'sessions', :action => 'show', :conditions => { :method => :get }
  
  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  
  map.namespace :admin do |admin|
    admin.resources :widgets, :as => 'apps', :except => :show
    admin.resources :categories, :except => :show
  end
  
  map.connections 'connections/following', :controller => "connections", :action => 'following'
  map.connections 'connections/followers', :controller => "connections", :action => 'followers'
  map.connections 'connections', :controller => "connections", :action => :create
  map.connections 'connections', :controller => "connections", :action => :destroy
  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :bgimages,  :except => [:new, :edit, :show, :update, :destroy]
  map.resources :categories, :except => [:new, :edit, :show, :update, :destroy, :create]
end