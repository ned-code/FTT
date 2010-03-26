require 'spec_helper'

describe ExploreController do

  should_route :index,    '/explore', :controller => 'explore', :action => :index
  
end
