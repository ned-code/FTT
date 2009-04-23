require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsersController do
  integrate_views

  before(:each) do
    activate_authlogic
  end

  context 'anonymous user' do

    it 'should access to registration form' do
      get :new

      UserSession.find.should be_nil
      response.should be_success
    end

    it "should register and send activation email" do
      post :create, :user => Factory.attributes_for(:user)

      response.should redirect_to(root_url)
      # TODO: Test if activation mail is send
      assigns(:user).should_not be_confirmed
      # TODO: Better test expression ?
      assigns(:user).should_not be_is_registered

      UserSession.find.should be_nil
    end

    it "should confirm and send confirmation email" do
      user = Factory.create(:user)
      user.reset_perishable_token!

      get :confirm, :id => user.perishable_token

      response.should redirect_to(root_url)
      # TODO: Test if confirmation mail is send
      assigns(:user).should be_confirmed
      # TODO: Better test expression ?
      assigns(:user).should be_is_registered

      UserSession.find.should_not be_nil
    end

    it 'should not access to index' do
      get :index

      response.should redirect_to(new_session_url)

      UserSession.find.should be_nil
    end

    it 'should not show an user' do
      another_user = Factory.build(:confirmed_user)
      another_user.save_without_session_maintenance
      another_user.is_registered

      get :show, :id => another_user.id

      UserSession.find.should be_nil
      response.should redirect_to(new_session_url)
    end

  end

  context 'registred user' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
    end

    it 'should update current user' do
      new_attributes = {}

      put :update, :id => @current_user.id, :user => new_attributes

      response.should redirect_to(edit_user_url(@current_user))
    end

#    it "email should be updated and activation email should be send" do
#      new_email = 'another.email@test.com'
#
#      put :update, :id => @current_user.id, :user => {:email => new_email}
#
#      response.should redirect_to(edit_user_url(@current_user))
#      # TODO: Test if activation mail is send
#      @current_user.should_not be_confirmed
#    end

    it 'should delete current user' do
      delete :destroy, :id => @current_user.id

      response.should redirect_to(root_url)
      lambda { User.find(@current_user.id) }.should raise_error(ActiveRecord::RecordNotFound)

      UserSession.find.should be_nil
    end

    it 'should not access to index' do
      get :index

      response.should redirect_to(root_url)
    end

    it 'should show current user' do
      get :show, :id => @current_user.id

      response.should be_success
      assigns(:user).should == @current_user
    end

  end

  context 'administrator' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
      @current_user.is_administrator
    end

    it "should create user and send confirmation email" do
      post :create, :user => Factory.attributes_for(:user)

      response.should redirect_to(users_url)
      # TODO: Test if activation mail is not send
      # TODO: Test if confirmation mail is send
      assigns(:user).should_not == @current_user
      assigns(:user).should be_confirmed
      # TODO: Better test expression ?
      assigns(:user).should be_is_registered
    end

    it 'should access to index' do
      get :index

      response.should be_success
    end

    context 'on another user' do

      before(:each) do
        @another_user = Factory.build(:confirmed_user)
        @another_user.save_without_session_maintenance
        @another_user.is_registered
      end

      it "should update" do
        put :update, :id => @another_user.id, :user => {}

        response.should redirect_to(edit_user_url(@another_user))
      end

#      it "should update email and not send activation email" do
#        new_email = 'another.email@test.com'
#
#        put :update, :id => @another_user.id, :user => {:email => new_email}
#
#        response.should redirect_to(edit_user_url(@another_user))
#        @another_user.should be_confirmed
#        # TODO: Test if activation mail is not send
#      end

      it "should delete" do
        delete :destroy, :id => @another_user.id

        response.should redirect_to(users_url)
        lambda { User.find(@another_user.id) }.should raise_error(ActiveRecord::RecordNotFound)

        UserSession.find.should_not be_nil
      end

      it 'should show' do
        get :show, :id => @another_user.id

        response.should be_success
        assigns(:user).should == @another_user
      end

    end
  end
end