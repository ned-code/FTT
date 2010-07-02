require 'spec_helper'

describe Admin::WidgetsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/admin/apps" }.should route_to(:controller => "admin/widgets", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/admin/apps/new" }.should route_to(:controller => "admin/widgets", :action => "new")
    end

    it "recognizes and generates #create" do
      { :post => "/admin/apps" }.should route_to(:controller => "admin/widgets", :action => "create")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/admin/apps/1" }.should route_to(:controller => "admin/widgets", :action => "destroy", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/admin/apps/1/edit" }.should route_to(:controller => "admin/widgets", :action => "edit", :id => "1")
    end

    it "recognizes and generates #update" do
      { :put => "/admin/apps/1" }.should route_to(:controller => "admin/widgets", :action => "update", :id => "1")
    end

  end
  
end
