require 'spec_helper'

describe DocumentRolesController do

  describe "routing" do

    it "recognizes and generates #show" do
      { :get => "/documents/1/roles" }.should route_to(:controller => "document_roles", :action => "show", :document_id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/documents/1/roles" }.should route_to(:controller => "document_roles", :action => "create", :document_id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/documents/1/roles" }.should route_to(:controller => "document_roles", :action => "destroy", :document_id => "1")
    end

    it "recognizes and generates #update" do
      { :put => "/documents/1/roles" }.should route_to(:controller => "document_roles", :action => "update", :document_id => "1")
    end

  end
  
end