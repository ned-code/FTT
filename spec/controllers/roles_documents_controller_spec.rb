require 'spec_helper'

describe RolesDocumentsController do

  context 'with signed in user' do

    before do
      @mock_user = mock_model(User, :active? => true, :confirmed? => true)
      User.stub(:find).and_return(@mock_user)
      @mock_user.stub(:uuid).and_return(UUID::generate)
      sign_in :user, @mock_user
    end

    describe "GET 'index'" do
      it "should not be successful" do
        Role.should_receive(:all_by_user_document_ids_grouped_by_name).with(@mock_user).and_return([])
        get 'index'
        response.should be_success
      end
    end

  end

  context "with guest" do

    describe "GET 'index'" do
      it "should be redirect" do
        get 'index'
        response.should be_redirect
      end
    end

  end
  
end
