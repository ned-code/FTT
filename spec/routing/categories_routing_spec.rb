require 'spec_helper'

describe CategoriesController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/categories" }.should route_to(:controller => "categories", :action => "index")
    end

  end
    
end
