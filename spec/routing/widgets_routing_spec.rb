require 'spec_helper'

describe WidgetsController do
  
  should_route :get,    '/widgets',        :action => :index
  should_route :get,    '/widgets/1',      :action => :show,    :id => 1
  should_route :post,   '/widgets',        :action => :create
  should_route :delete, '/widgets/1',      :action => :destroy, :id => 1
  
end
