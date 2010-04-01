ActionController::Routing::Routes.draw do |map|
  Jammit::Routes.draw(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.connect 'proxy/get', :controller => 'proxy', :action => 'get', :conditions => { :method => :get }
  map.connect 'proxy/post', :controller => 'proxy', :action => 'post', :conditions => { :method => :post }
  map.connect 'proxy/put', :controller => 'proxy', :action => 'put', :conditions => { :method => :put }
  map.connect 'proxy/delete', :controller => 'proxy', :action => 'delete', :conditions => { :method => :delete }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items } do |m|
    m.resource :document_roles, :as => 'roles', :only => [:show, :create, :update, :destroy]
  end
  
  map.connect 'items/:item_id/datastore_entries/:key', :controller => 'datastore_entries', :action => 'index', :only_current_user => true, :conditions => { :method => :get }
  map.resources :items, :except => [:index, :show, :create, :new, :edit, :update, :destroy] do |item|
    item.resources :datastore_entries, :only => [:index, :create, :destroy]
  end
  map.connect 'items/:item_id/datastore_entries', :controller => 'datastore_entries', :action => 'destroy_all', :conditions => { :method => :delete }
  
  map.resources :datastores, :only => [:show, :index] do |datastore|
    # datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  end
  
  map.devise_for :users
  map.resources :users, :except => [:new, :create, :destroy]
  map.connect 'user', :controller => 'sessions', :action => 'show', :conditions => { :method => :get }
    
  map.namespace :admin do |admin|
    admin.resources :widgets, :as => 'apps', :except => :show
    admin.resources :categories, :except => :show
    admin.resource :test, :only => :show
  end
  
  map.followships 'followships', :controller => "followships", :action => :index
  map.following 'following', :controller => "followships", :action => 'following'
  map.followers 'followers', :controller => "followships", :action => 'followers'
  map.follow 'follow', :controller => "followships", :action => :create
  map.unfollow 'unfollow', :controller => "followships", :action => :destroy
  
  map.explore 'explore', :controller => "explore", :action => 'index'
  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :categories, :only => :index
  map.resources :roles_documents, :only => :index, :as => "roles/documents"
  
end