require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsersController do
  integrate_views

  before(:each) do
    activate_authlogic
  end

  context 'accessed by a anonymous user' do

    it "'GET /users' should be redirect to login page" do
      get :index

      response.should redirect_to(new_session_url)
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/:id' should be redirect to login page" do
      another_user = Factory.build(:confirmed_user)
      another_user.save_without_session_maintenance
      another_user.is_registered

      get :show, :id => another_user.id

      response.should redirect_to(new_session_url)
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/new' should be rendered" do
      get :new

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/new' should have an email field" do
      get :new

      response.should have_tag('input[name=?]', 'user[email]')
    end

    it "'GET /users/new' should have the fields password and password_confirmation" do
      get :new

      response.should have_tag('input[name=?]', 'user[password]')
      response.should have_tag('input[name=?]', 'user[password_confirmation]')
    end

    it "'GET /users/new' should have the fields firstname and lastname" do
      get :new

      response.should have_tag('input[name=?]', 'user[firstname]')
      response.should have_tag('input[name=?]', 'user[lastname]')
    end

    it "'POST /users' should create the user and send activation email" do
      post :create, :user => Factory.attributes_for(:user)

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)

      response.should send_email do
      end

      assigns(:user).should have(:no).errors
      assigns(:user).should_not be_confirmed
      assigns(:user).should_not be_is_registered
    end

    it "'POST /users' should not create the user and send activation email without valid parameters" do
      post :create, :user => Factory.attributes_for(:user, :email => nil)

      response.should_not redirect_to(root_url)
      response.should respond_with(:content_type => :html)

      response.should have_tag('div.errorExplanation')

      response.should_not send_email do
      end

      assigns(:user).should have_at_least(1).errors
    end

    context 'for unconfirmed user' do

      before(:each) do
        @user = Factory.create(:user)
        @user.reset_perishable_token!
      end

      it "'GET /users/:token/confirm' should confirm the user and send confirmation email" do
        get :confirm, :id => @user.perishable_token

        response.should redirect_to(root_url)
        response.should respond_with(:content_type => :html)

        response.should send_email do
        end

        assigns(:user).should have(:no).errors
        assigns(:user).should be_confirmed
        assigns(:user).should be_is_registered
      end

    end
  end

  context 'accessed by a registered user' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
      UserSession.create(@current_user)

      @another_user = Factory.create(:confirmed_user)
      @another_user.is_registered
    end

    it "'GET /users' should be redirect to root page (access denied)" do
      get :index

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/:id' on current user should be rendered" do
      get :show, :id => @current_user.id

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/:id' on another user should be redirect to root page (access denied)" do
      get :show, :id => @another_user.id

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/:id/edit' should be rendered" do
      get :edit, :id => @current_user.id

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/:id/edit' on another user should be redirect to root page (access denied)" do
      get :edit, :id => @another_user.id

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)
    end

    it "'PUT /users/:id' should update user attributes" do
      new_attributes = {'firstname' => 'New', 'lastname' => 'Another'}

      put :update, :id => @current_user.id, :user => new_attributes

      response.should redirect_to(edit_user_url(@current_user))
      response.should respond_with(:content_type => :html)

      @current_user.reload
      @current_user.attributes.should include(new_attributes)
    end

    it "'PUT /users/:id' on another user should be redirect to root page (access denied)" do
      new_attributes = {'firstname' => 'New', 'lastname' => 'Another'}

      put :update, :id => @another_user.id, :user => new_attributes

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)

      @another_user.reload
      @another_user.attributes.should_not include(new_attributes)
    end

    it "'DELETE /users/:id' should delete the user and redirect to root page" do
      delete :destroy, :id => @current_user.id

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)

      UserSession.find.should be_nil

      lambda { User.find(@current_user.id) }.should raise_error(ActiveRecord::RecordNotFound)
    end

    it "'DELETE /users/:id' on another user should be redirect to root page (access denied)" do
      delete :destroy, :id => @another_user.id

      response.should redirect_to(root_url)
      response.should respond_with(:content_type => :html)

      UserSession.find.should_not be_nil

      lambda { User.find(@current_user.id) }.should_not raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context 'accessed by a administrator user' do

    before(:each) do
      @current_user = Factory.create(:confirmed_user)
      @current_user.is_registered
      @current_user.is_administrator

      @another_user = Factory.create(:confirmed_user)
      @another_user.is_registered
    end

    it "'GET /users' should be rendered" do
      get :index

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'GET /users/new' should be rendered" do
      get :new

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'POST /users' should create the user, confirm, and send confirmation email" do
      post :create, :user => Factory.attributes_for(:user)

      response.should redirect_to(users_url)
      response.should respond_with(:content_type => :html)

      response.should send_email do
      end

      assigns(:user).should have(:no).errors
      assigns(:user).should be_confirmed
      assigns(:user).should be_is_registered
    end

    it "'GET /users/:id/edit' on another user should be rendered" do
      get :edit, :id => @another_user.id

      response.should be_success
      response.should respond_with(:content_type => :html)
    end

    it "'PUT /users/:id' on another should update user attributes" do
      new_attributes = {'firstname' => 'New', 'lastname' => 'Another'}

      put :update, :id => @another_user.id, :user => new_attributes

      response.should redirect_to(edit_user_url(@another_user))
      response.should respond_with(:content_type => :html)

      @another_user.reload
      @another_user.attributes.should include(new_attributes)
    end

    it "'DELETE /users/:id' on another should delete the user and redirect to users page" do
      delete :destroy, :id => @another_user.id

      response.should redirect_to(users_url)
      response.should respond_with(:content_type => :html)

      UserSession.find.should_not be_nil

      lambda { User.find(@another_user.id) }.should raise_error(ActiveRecord::RecordNotFound)
    end

  end
end