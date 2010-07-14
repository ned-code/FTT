require 'spec_helper'

describe HomeController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/" }.should route_to(:controller => "home", :action => "show")
    end

  end
    
end
