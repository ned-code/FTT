require 'spec_helper'

describe "Users" do
  
  it "should be able to login" do
    sign_in_as_user(:email => "john@doe.com")
    response.should contain("john@doe.com")
    response.should contain("logout")
  end
  
end
