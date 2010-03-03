require 'spec_helper'

describe FollowshipsController do
  
  should_route :get,    '/followships/followers', :controller => 'followships', :action => :followers
  should_route :get,    '/followships/following', :controller => 'followships', :action => :following
  should_route :post,   '/followships', :controller => 'followships', :action => :create
  #should_route :delete, '/followships', :controller => 'followships', :action => :destroy
  
end
