ActionController::Routing::Routes.draw do |map|
  map.resource :session

  map.resources :accounts
  map.resource :account

  map.root :controller => 'sessions', :action => 'new'
end
