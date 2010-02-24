require 'spec_helper'

describe "Users" do
  
  it "should work" do
    visit root_path
    response.should be_success
  end
  
end
