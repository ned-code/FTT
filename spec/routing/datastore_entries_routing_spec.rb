require 'spec_helper'

describe DatastoreEntriesController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/items/1/datastore_entries" }.should route_to(:controller => "datastore_entries", :action => "index", :item_id => "1")
    end

    it "recognizes and generates #vote" do
      { :get => "/items/1/datastore_entries/vote" }.should route_to(:controller => "datastore_entries", :action => "index", :item_id => "1", :key => 'vote', :only_current_user => true)
    end

    it "recognizes and generates #create" do
      { :post => "/items/1/datastore_entries" }.should route_to(:controller => "datastore_entries", :action => "create", :item_id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/items/1/datastore_entries/1" }.should route_to(:controller => "datastore_entries", :action => "destroy", :item_id => "1", :id => "1")
    end

    it "recognizes and generates #destroy_all" do
      { :delete => "/items/1/datastore_entries" }.should route_to(:controller => "datastore_entries", :action => "destroy_all", :item_id => "1")
    end

  end
  
end
