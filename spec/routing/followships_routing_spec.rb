require 'spec_helper'

describe FollowshipsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/followships" }.should route_to(:controller => "followships", :action => "index")
    end

    it "recognizes and generates #edit" do
      { :post => "/followships/follow" }.should route_to(:controller => "followships", :action => "follow")
    end

    it "recognizes and generates #update" do
      { :delete => "/followships/unfollow" }.should route_to(:controller => "followships", :action => "unfollow")
    end

  end
  
end
