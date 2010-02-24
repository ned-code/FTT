require 'spec_helper'

describe HomeController do
  
  should_route :get, '/', :action => :show, :controller => 'home'
  
end
