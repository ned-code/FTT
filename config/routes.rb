ActionController::Routing::Routes.draw do |map|
  Jammit::Routes.draw(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.connect 'proxy/get', :controller => 'proxy', :action => 'get', :conditions => { :method => :get }
  map.connect 'proxy/post', :controller => 'proxy', :action => 'post', :conditions => { :method => :post }
  map.connect 'proxy/put', :controller => 'proxy', :action => 'put', :conditions => { :method => :put }
  map.connect 'proxy/delete', :controller => 'proxy', :action => 'delete', :conditions => { :method => :delete }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items }, :member => { :duplicate => :post }, :collection => { :explore => :get, :featured => :get } do |m|
    m.resource :document_roles, :as => 'roles', :only => [:show, :create, :update, :destroy]
  end

  map.connect 'items/:item_id/datastore_entries/:key', :controller => 'datastore_entries', :action => 'index', :only_current_user => true, :conditions => { :method => :get }
  map.resources :items, :except => [:index, :show, :create, :new, :edit, :update, :destroy] do |item|
    item.resources :datastore_entries, :only => [:index, :create, :destroy]
  end
  map.connect 'items/:item_id/datastore_entries', :controller => 'datastore_entries', :action => 'destroy_all', :conditions => { :method => :delete }
  
  map.connect '/documents/:document_id/pages/:page_id/items/:id/secure_token', :controller => 'items', :action => 'secure_token', :conditions => { :method => :get }

  map.connect '/documents/:document_id/pages/:page_id/callback_thumbnail', :controller => 'pages', :action => 'callback_thumbnail', :conditions => { :method => :get }

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
    admin.resources :themes
  end
  
  map.resources :followships, :collection => { :follow => :post, :unfollow => :delete }
  map.connect '/browse', :controller => 'browser', :action => :index, :conditions => { :method => :get }
  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :categories, :only => :index
  map.resources :themes, :only => [:index, :show]
  map.resources :roles_documents, :only => :index, :as => "roles/documents"

  # comments
  map.resources :discussions, :only => [:index, :create, :update, :destroy] do |discussion|
    discussion.resources :comments, :only => [:create, :destroy]
  end

end
