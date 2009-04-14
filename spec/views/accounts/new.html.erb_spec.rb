require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/accounts/new.html.erb" do
  include AccountsHelper
  
  before(:each) do
    assigns[:accounts] = stub_model(Accounts,
      :new_record? => true
    )
  end

  it "renders new accounts form" do
    render
    
    response.should have_tag("form[action=?][method=post]", accounts_path) do
    end
  end
end


