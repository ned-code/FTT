require 'spec_helper'

describe FollowshipsController do
  
  should_route :get,    '/followers', :controller => 'followships', :action => :followers
  should_route :get,    '/following', :controller => 'followships', :action => :following
  should_route :post,   '/follow', :controller => 'followships', :action => :create
  should_route :delete, '/unfollow', :controller => 'followships', :action => :destroy
  
end
