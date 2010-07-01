require 'spec_helper'

describe ItemsController do

  describe "routing" do

    it "recognizes and generates #create" do
      { :post => "/documents/1/pages/1/items" }.should route_to(:controller => "items",
                                                                :action => "create",
                                                                :document_id => "1",
                                                                :page_id => "1")
    end

    it "recognizes and generates #update" do
      { :put => "/documents/1/pages/1/items/1" }.should route_to(:controller => "items",
                                                                 :action => "update",
                                                                 :document_id => "1",
                                                                 :page_id => "1",
                                                                 :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/documents/1/pages/1/items/1" }.should route_to(:controller => "items",
                                                                    :action => "destroy",
                                                                    :document_id => "1",
                                                                    :page_id => "1",
                                                                    :id => "1")
    end

  end
  
end