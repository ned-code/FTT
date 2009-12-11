ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.root :controller => 'documents', :action => :index
  
  map.resources :documents, :has_many => { :pages => :items }, :member => { :change_user_access => :put, :user_access => :get}
  
  #map.resource :datastores, :as => 'datastore',  :new => [:set => :get], :path_names => {:set => 'set'}#, :only => [:set],
  map.resource :datastores, :as => 'datastore',  :member => { :set => :get, :get => :get, :getAllKeys => :get, :remove => :get, :getForCurrentUser => :get }#, :only => [:set],
  
  map.resources :users, :except => :new
  map.with_options :controller => 'users', :conditions => { :method => :get } do |m|
    m.signup 'signup', :action => 'new'
  end

  map.resource :user_sessions, :only => :create
  map.with_options :controller => 'user_sessions', :conditions => { :method => :get } do |m|
    m.login  '/login',  :action => 'new' # login_path
    m.logout '/logout', :action => 'destroy' # logout_path
  end

  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  
  # dev controller
  map.resources :medias
end