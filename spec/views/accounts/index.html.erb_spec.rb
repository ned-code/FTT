require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/accounts/index.html.erb" do
  include AccountsHelper
  
  before(:each) do
    assigns[:accounts] = [
      stub_model(Accounts),
      stub_model(Accounts)
    ]
  end

  it "renders a list of accounts" do
    render
  end
end

