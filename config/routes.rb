ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  
  map.root :controller => 'home', :action => :show
  
  map.resources :documents, :has_many => { :pages => :items }, :member => { :change_user_access => :put, :user_access => :get}
  
  map.resources :datastores, :only => [:show] do |datastore|
      datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  end
  
  map.devise_for :users
  map.resources :users
  map.connect 'user', :controller => 'sessions', :action => 'show', :conditions => { :method => :get }
  
  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  
  # dev controller
  map.resources :medias
  map.resources :images, :except => [:new, :edit, :update]
  map.resources :videos, :except => [:new, :edit, :update]
  map.resources :widgets, :collection => { :listing => :get }, :member => { :do_update => :get , :update_action => :put }
end