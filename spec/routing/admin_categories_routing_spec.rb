require 'spec_helper'

describe Admin::CategoriesController do

    describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/admin/categories" }.should route_to(:controller => "admin/categories", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/admin/categories/new" }.should route_to(:controller => "admin/categories", :action => "new")
    end

    it "recognizes and generates #create" do
      { :post => "/admin/categories" }.should route_to(:controller => "admin/categories", :action => "create")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/admin/categories/1" }.should route_to(:controller => "admin/categories", :action => "destroy", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/admin/categories/1/edit" }.should route_to(:controller => "admin/categories", :action => "edit", :id => "1")
    end

    it "recognizes and generates #update" do
      { :put => "/admin/categories/1" }.should route_to(:controller => "admin/categories", :action => "update", :id => "1")
    end

  end
  
end
