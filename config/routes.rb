ActionController::Routing::Routes.draw do |map|
  map.resource :session do |session|
    session.resource :password_reset
  end
  map.resource :time

  map.resources :users, :member => {:confirm => :get, :change_password => :get}

  map.connect 'documents/delete_all',
    :controller => 'documents', :action => 'destroy_all',
    :conditions => { :method => :get }
  map.resources :documents do |document|
    document.resources :pages
  end

  map.root :controller => 'documents', :action => 'index'
end
