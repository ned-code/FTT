require 'spec_helper'

describe DocumentsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/documents" }.should route_to(:controller => "documents", :action => "index")
    end

    it "recognizes and generates #explore" do
      { :get => "explore" }.should route_to(:controller => "documents", :action => "explore")
    end

    it "recognizes and generates #featured" do
      { :get => "featured" }.should route_to(:controller => "documents", :action => "featured")
    end

    it "recognizes and generates #show" do
      { :get => "/documents/1" }.should route_to(:controller => "documents", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/documents/1/edit" }.should route_to(:controller => "documents", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/documents" }.should route_to(:controller => "documents", :action => "create")
    end

    it "recognizes and generates #update" do
      { :put => "/documents/1" }.should route_to(:controller => "documents", :action => "update", :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/documents/1" }.should route_to(:controller => "documents", :action => "destroy", :id => "1")
    end

  end

end
