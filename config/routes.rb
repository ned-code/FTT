ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items }, :member => { :change_user_access => :put, :user_access => :get} do |m|
    m.resource :accesses, :only => [:show, :create, :update]
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
  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :bgimages,  :except => [:new, :edit, :show, :update, :destroy]
  map.resources :categories, :except => [:new, :edit, :show, :update, :destroy, :create]
end