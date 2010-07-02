require 'spec_helper'

describe PagesController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/documents/1/pages" }.should route_to(:controller => "pages", :action => "index", :document_id => "1")
    end

    it "recognizes and generates #show" do
      { :get => "/documents/1/pages/1" }.should route_to(:controller => "pages", :action => "show", :document_id => "1", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/documents/1/pages" }.should route_to(:controller => "pages", :action => "create", :document_id => "1")
    end

    it "recognizes and generates #update" do
      { :put => "/documents/1/pages/1" }.should route_to(:controller => "pages", :action => "update", :document_id => "1", :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/documents/1/pages/1" }.should route_to(:controller => "pages", :action => "destroy", :document_id => "1", :id => "1")
    end

  end
  
end