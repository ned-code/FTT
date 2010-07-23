require 'spec_helper'

describe WidgetsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/apps" }.should route_to(:controller => "widgets", :action => "index")
    end

  end
    
end
