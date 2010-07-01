require 'spec_helper'

describe WidgetsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/widgets" }.should route_to(:controller => "widgets", :action => "index")
    end

    it "recognizes and generates #show" do
      { :get => "/widgets/1" }.should route_to(:controller => "widgets", :action => "show", :id => "1")
    end

  end
    
end
