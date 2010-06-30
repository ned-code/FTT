require 'spec_helper'

describe RolesDocumentsController do
  include Devise::TestHelpers
  
  # context "with signed in user" do
  #   before(:each) do
  #     @mock_user = mock_model(User, :active? => true, :confirmed? => true)
  #     User.stub(:find).and_return(@mock_user)
  #     sign_in :user, @mock_user
  #   end
  #
  #   describe :get => :index do
  #     expects :all_by_user_document_ids_grouped_by_name, :on => Role, :with => lambda { @mock_user }, :returns => []
  #     should_respond_with :success, :content_type => :json
  #   end
  #
  # end
  #
  # context "with guest" do
  #
  #   describe :get => :index do
  #     should_respond_with :redirect
  #   end
  #
  # end
  
end
