require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/accounts/edit.html.erb" do
  include AccountsHelper
  
  before(:each) do
    assigns[:accounts] = @accounts = stub_model(Accounts,
      :new_record? => false
    )
  end

  it "renders the edit accounts form" do
    render
    
    response.should have_tag("form[action=#{accounts_path(@accounts)}][method=post]") do
    end
  end
end


