ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  map.connect 'documents/index_page', :controller => 'documents', :action => 'index_page', :conditions => { :method => :get }
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  map.root :controller => 'documents', :action => 'index_page'
  
  map.resources :documents, :has_many => { :pages => :items }
  
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