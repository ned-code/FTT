ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.root :controller => 'documents', :action => :index
  
  map.resources :documents, :has_many => { :pages => :items }, :member => { :change_user_access => :put, :user_access => :get}
  
  map.resources :datastores, :only => [:show] do |datastore|
      datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  end
  
  map.with_options :controller => 'users', :conditions => { :method => :get } do |m|
    m.signup 'signup', :action => 'new'
    m.current '/users/current', :action => 'current'
  end
  map.resources :users, :except => :new
  
  map.resource :user_sessions, :only => :create
  map.with_options :controller => 'user_sessions', :conditions => { :method => :get } do |m|
    m.login  '/login',  :action => 'new' # login_path
    m.logout '/logout', :action => 'destroy' # logout_path
  end

  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  
  map.namespace :admin do |admin|
    admin.resources :widgets, :as => 'apps', :except => :show
  end
  
  # dev controller
  map.resources :images,    :except => [:new, :edit, :update]
  map.resources :videos,    :except => [:new, :edit, :update]
  map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  map.resources :bgimages,  :except => [:new, :edit, :show, :update, :destroy]
  map.resources :categories, :except => [:new, :edit, :show, :update, :destroy, :create]
end