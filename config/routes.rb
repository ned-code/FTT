Webdoc::Application.routes.draw do

  # Jammit::Routes.draw(map) #TODO not need in rails3 ?

  get    'proxy/resolve'
  get    'proxy/get'
  post   'proxy/post'
  put    'proxy/put'
  delete 'proxy/delete'

  root :to => 'home#show'

  resources :documents do
    resources :pages do
      resources :items
    end
    resource :document_roles, :only => [:show, :create, :update, :destroy], :path => 'roles'
    #   m.resource :document_roles, :as => 'roles', :only => [:show, :create, :update, :destroy]
    
    member do
      post :duplicate
      post :unshare
      post :share
    end
    collection do
      get :explore
      get :featured
      get :template
    end
  end

  # TODO rails3 always need :only_current_user => true ?
  get    'items/:item_id/datastore_entries/:key' => 'datastore_entries#index'
  delete 'items/:item_id/datastore_entries' => 'datastore_entries#destroy_all'
  # TODO rails same route as before, no??
  resources :items, :except => [:index, :show, :create, :new, :edit, :update, :destroy] do
    resources :datastore_entries, :only => [:index, :create, :destroy]
  end
  resources :datastores, :only => [:show, :index]

  get '/documents/:document_id/pages/:page_id/items/:id/secure_token' => 'items#secure_token'
  get '/documents/:document_id/pages/:page_id/callback_thumbnail' => 'pages#callback_thumbnail'

  devise_for :users

  resources :users, :only => [:index, :show, :favorites]

  get 'user' => 'sessions#show'  

  namespace :admin do
    get '/' => 'home#index'
    resources :widgets, :except => :show
    resources :categories, :except => :show
    resource  :test, :only => :show
    resources :themes
  end

  resources :followships do
    collection do
      post :follow
      delete :unfollow
    end
  end
  
  resources :friendships do
    collection do
      post :become_friend, :accept, :reject, :block, :cancel_request, :revoke
      delete :revoke
    end
  end

  get '/browse' => 'browser#index'

  get '/dashboard' => 'users#dashboard'

  # dev controller
  resources :images,     :except => [:new, :edit, :update]
  resources :videos,     :except => [:new, :edit, :update]
  resources :widgets,    :except => [:new, :edit, :update, :destroy]
  resources :categories, :only => :index
  resources :themes,     :only => [:index, :show]

  resources :roles_documents, :only => [:index], :path => 'roles/documents'

  # comments
  resources :discussions, :only => [:index, :create, :update, :destroy] do
    resources :comments, :only => [:create, :destroy]
  end

  resources :app_polls, :only => [:index, :create, :destroy]

  namespace :facebook do
    resources :albums, :only => [:index] do
      resources :photos, :only => [:index]
    end
  end

  # START OLD ROUTES
  # Jammit::Routes.draw(map)
  # map.connect 'proxy/resolve', :controller => 'proxy', :action => 'resolve', :conditions => { :method => :get }
  # map.connect 'proxy/get', :controller => 'proxy', :action => 'get', :conditions => { :method => :get }
  # map.connect 'proxy/post', :controller => 'proxy', :action => 'post', :conditions => { :method => :post }
  # map.connect 'proxy/put', :controller => 'proxy', :action => 'put', :conditions => { :method => :put }
  # map.connect 'proxy/delete', :controller => 'proxy', :action => 'delete', :conditions => { :method => :delete }
  #
  # map.root :controller => 'home', :action => :show
  #
  # map.resources :documents, :has_many => { :pages => :items }, :member => { :duplicate => :post }, :collection => { :explore => :get, :featured => :get } do |m|
  #   m.resource :document_roles, :as => 'roles', :only => [:show, :create, :update, :destroy]
  # end
  #
  # map.connect 'items/:item_id/datastore_entries/:key', :controller => 'datastore_entries', :action => 'index', :only_current_user => true, :conditions => { :method => :get }
  # map.resources :items, :except => [:index, :show, :create, :new, :edit, :update, :destroy] do |item|
  #   item.resources :datastore_entries, :only => [:index, :create, :destroy]
  # end
  # map.connect 'items/:item_id/datastore_entries', :controller => 'datastore_entries', :action => 'destroy_all', :conditions => { :method => :delete }
  #
  # map.connect '/documents/:document_id/pages/:page_id/items/:id/secure_token', :controller => 'items', :action => 'secure_token', :conditions => { :method => :get }
  #
  # map.connect '/documents/:document_id/pages/:page_id/callback_thumbnail', :controller => 'pages', :action => 'callback_thumbnail', :conditions => { :method => :get }
  #
  # map.resources :datastores, :only => [:show, :index] do |datastore|
  #   # datastore.resources :datastoreEntries, :except => [:new, :update, :edit]
  # end
  #
  # map.connect '/apps', :controller => 'widgets', :action => 'index', :conditions => { :method => :get }
  # map.connect '/users/favorites', :controller => 'users', :action => 'favorites', :conditions => { :method => :get } #this route is used to get html that is display in media browser favorites
  # map.devise_for :users
  # map.resources :users, :except => [:new, :create, :destroy]
  # map.connect 'user', :controller => 'sessions', :action => 'show', :conditions => { :method => :get }
  #
  # map.namespace :admin do |admin|
  #   admin.resources :widgets, :as => 'apps', :except => :show
  #   admin.resources :categories, :except => :show
  #   admin.resource :test, :only => :show
  #   admin.resources :themes
  # end
  #
  # map.resources :followships, :collection => { :follow => :post, :unfollow => :delete }
  # map.connect '/browse', :controller => 'browser', :action => :index, :conditions => { :method => :get }
  #
  # # dev controller
  # map.resources :images,    :except => [:new, :edit, :update] #/images is used to get html that is displayed in media browser my images
  # map.resources :videos,    :except => [:new, :edit, :update]
  # map.resources :widgets,   :except => [:new, :edit, :update, :destroy]
  # map.resources :categories, :only => :index
  # map.resources :themes, :only => [:index, :show]
  # map.resources :roles_documents, :only => :index, :as => "roles/documents"
  #
  # # comments
  # map.resources :discussions, :only => [:index, :create, :update, :destroy] do |discussion|
  #   discussion.resources :comments, :only => [:create, :destroy]
  # end
  # END OLD ROUTES

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get :short
  #       post :toggle
  #     end
  #
  #     collection do
  #       get :sold
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get :recent, :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end


