ActionController::Routing::Routes.draw do |map|
  
  map.root :controller => 'documents', :action => 'index'
  
  map.resource :session do |session|
    session.resource :password_reset
  end
  map.resource :time

  map.resources :users, :member => {:confirm => :get, :change_password => :get}

  map.resources :documents, :member => { :push => :post, :resources => :get } do |document|
    document.resources :pages, :member => {:proto => :get, :info => :get, :update => :post, :content => :get}
  end

  map.resources :medias

  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
end