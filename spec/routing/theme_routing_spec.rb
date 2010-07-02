require 'spec_helper'

describe ThemesController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/themes" }.should route_to(:controller => "themes", :action => "index")
    end

    it "recognizes and generates #show" do
      { :get => "/themes/1" }.should route_to(:controller => "themes", :action => "show", :id => "1")
    end

  end
  
end
