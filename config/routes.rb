ActionController::Routing::Routes.draw do |map|
  map.resource :session

  map.resources :users, :member => {:confirm => :get}

  map.root :controller => 'sessions', :action => 'new'
end
