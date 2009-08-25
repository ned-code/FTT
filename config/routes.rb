ActionController::Routing::Routes.draw do |map|
  map.resource :session do |session|
    session.resource :password_reset
  end
  map.resource :time

  map.resources :users, :member => {:confirm => :get, :change_password => :get}

  map.connect 'documents/delete_all',
    :controller => 'documents', :action => 'destroy_all',
    :conditions => { :method => :get }
  map.resources :documents, :member => {:push => :post, :resources => :get} do |document|
    document.resources :pages, :member => {:proto => :get, :info => :get, :update => :post, :content => :get}
  end

  map.resources :medias
  
  map.root :controller => 'documents', :action => 'index'

  map.connect 'orbit/show', :controller => 'test_orbit', :action => 'show'
  map.connect 'orbit/send_data', :controller => 'test_orbit', :action => 'send_data'
end
