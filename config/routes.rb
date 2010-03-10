ActionController::Routing::Routes.draw do |map|
  Jammit::Routes.draw(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.connect 'proxy/get', :controller => 'proxy', :action => 'get', :conditions => { :method => :get }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items } do |m|
    m.resource :accesses, :only => [:show, :create, :update, :destroy]
  end
  
  map.resources :datastores, :only => [:show, :index] do |datastore|
    datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  end
  
  map.devise_for :users
  map.resources :users, :except => [:new, :create, :destroy]
  map.connect 'user', :controller => 'sessions', :action => 'show', :conditions => { :method => :get }
  
  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  
  map.namespace :admin do |admin|
    admin.resources :widgets, :as => 'apps', :except => :show
    admin.resources :categories, :except => :show
    admin.resource :test, :only => :show
  end
  
  map.connections 'following', :controller => "followships", :action => 'following'
  map.connections 'followers', :controller => "followships", :action => 'followers'
  map.connections 'follow', :controller => "followships", :action => :create
  map.connections 'unfollow', :controller => "followships", :action => :destroy

  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :categories, :except => [:new, :edit, :show, :update, :destroy, :create]
  #map.resources :roles_documents, :only => :index, :as => "roles/documents"
end