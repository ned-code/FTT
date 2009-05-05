ActionController::Routing::Routes.draw do |map|
  map.resource :session
  map.resource :time

  map.resources :users, :member => {:confirm => :get}

  map.connect 'documents/delete_all',
    :controller => 'documents', :action => 'destroy_all',
    :conditions => { :method => :get }
  map.resources :documents do |document|
    document.resources :pages
  end

  map.root :controller => 'sessions', :action => 'new'
end
