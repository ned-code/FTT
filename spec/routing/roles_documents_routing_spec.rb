require 'spec_helper'

describe RolesDocumentsController do

  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/roles/documents" }.should route_to(:controller => "roles_documents", :action => "index")
    end

  end
    
end
