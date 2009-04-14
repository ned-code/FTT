require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe AccountsController do

  def mock_accounts(stubs={})
    @mock_accounts ||= mock_model(Accounts, stubs)
  end
  
  describe "GET index" do

    it "exposes all accounts as @accounts" do
      Accounts.should_receive(:find).with(:all).and_return([mock_accounts])
      get :index
      assigns[:accounts].should == [mock_accounts]
    end

    describe "with mime type of xml" do
  
      it "renders all accounts as xml" do
        Accounts.should_receive(:find).with(:all).and_return(accounts = mock("Array of Accounts"))
        accounts.should_receive(:to_xml).and_return("generated XML")
        get :index, :format => 'xml'
        response.body.should == "generated XML"
      end
    
    end

  end

  describe "GET show" do

    it "exposes the requested accounts as @accounts" do
      Accounts.should_receive(:find).with("37").and_return(mock_accounts)
      get :show, :id => "37"
      assigns[:accounts].should equal(mock_accounts)
    end
    
    describe "with mime type of xml" do

      it "renders the requested accounts as xml" do
        Accounts.should_receive(:find).with("37").and_return(mock_accounts)
        mock_accounts.should_receive(:to_xml).and_return("generated XML")
        get :show, :id => "37", :format => 'xml'
        response.body.should == "generated XML"
      end

    end
    
  end

  describe "GET new" do
  
    it "exposes a new accounts as @accounts" do
      Accounts.should_receive(:new).and_return(mock_accounts)
      get :new
      assigns[:accounts].should equal(mock_accounts)
    end

  end

  describe "GET edit" do
  
    it "exposes the requested accounts as @accounts" do
      Accounts.should_receive(:find).with("37").and_return(mock_accounts)
      get :edit, :id => "37"
      assigns[:accounts].should equal(mock_accounts)
    end

  end

  describe "POST create" do

    describe "with valid params" do
      
      it "exposes a newly created accounts as @accounts" do
        Accounts.should_receive(:new).with({'these' => 'params'}).and_return(mock_accounts(:save => true))
        post :create, :accounts => {:these => 'params'}
        assigns(:accounts).should equal(mock_accounts)
      end

      it "redirects to the created accounts" do
        Accounts.stub!(:new).and_return(mock_accounts(:save => true))
        post :create, :accounts => {}
        response.should redirect_to(account_url(mock_accounts))
      end
      
    end
    
    describe "with invalid params" do

      it "exposes a newly created but unsaved accounts as @accounts" do
        Accounts.stub!(:new).with({'these' => 'params'}).and_return(mock_accounts(:save => false))
        post :create, :accounts => {:these => 'params'}
        assigns(:accounts).should equal(mock_accounts)
      end

      it "re-renders the 'new' template" do
        Accounts.stub!(:new).and_return(mock_accounts(:save => false))
        post :create, :accounts => {}
        response.should render_template('new')
      end
      
    end
    
  end

  describe "PUT udpate" do

    describe "with valid params" do

      it "updates the requested accounts" do
        Accounts.should_receive(:find).with("37").and_return(mock_accounts)
        mock_accounts.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :accounts => {:these => 'params'}
      end

      it "exposes the requested accounts as @accounts" do
        Accounts.stub!(:find).and_return(mock_accounts(:update_attributes => true))
        put :update, :id => "1"
        assigns(:accounts).should equal(mock_accounts)
      end

      it "redirects to the accounts" do
        Accounts.stub!(:find).and_return(mock_accounts(:update_attributes => true))
        put :update, :id => "1"
        response.should redirect_to(account_url(mock_accounts))
      end

    end
    
    describe "with invalid params" do

      it "updates the requested accounts" do
        Accounts.should_receive(:find).with("37").and_return(mock_accounts)
        mock_accounts.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :accounts => {:these => 'params'}
      end

      it "exposes the accounts as @accounts" do
        Accounts.stub!(:find).and_return(mock_accounts(:update_attributes => false))
        put :update, :id => "1"
        assigns(:accounts).should equal(mock_accounts)
      end

      it "re-renders the 'edit' template" do
        Accounts.stub!(:find).and_return(mock_accounts(:update_attributes => false))
        put :update, :id => "1"
        response.should render_template('edit')
      end

    end

  end

  describe "DELETE destroy" do

    it "destroys the requested accounts" do
      Accounts.should_receive(:find).with("37").and_return(mock_accounts)
      mock_accounts.should_receive(:destroy)
      delete :destroy, :id => "37"
    end
  
    it "redirects to the accounts list" do
      Accounts.stub!(:find).and_return(mock_accounts(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(accounts_url)
    end

  end

end
