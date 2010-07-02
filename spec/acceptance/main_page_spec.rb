require File.dirname(__FILE__) + '/acceptance_helper'

feature "Main page" do

  background do
    # create_user :login => "jdoe"
    # login_as "jdoe"
  end
  
  scenario "sould show the homepage" do
    visit homepage
    page.should have_css("h1.logo", :count => 1)
  end

  scenario "should be able to login" do
    sign_in_as_user(:email => "john@doe.com")
    page.should have_content("john@doe.com")
    page.should have_content("logout")
  end

  # it "should be possible to register" do
  #   visit homepage
  #   click_link "Sign up"
  #   fill_in "Email",      :with => "john@doe.com"
  #   fill_in "First name", :with => "John"
  #   fill_in "Last name",  :with => "Doe"
  #   fill_in "Username",   :with => "johndoe"
  #   fill_in "Password",   :with => "123456"
  #   check "I agree to terms of service"
  #   click_button "Sign up"
  #   response.should contain("You have signed up successfully.")
  #   response.should contain("John Doe")
  #   response.should contain("logout")
  #   current_url.should == "http://www.example.com/documents"
  # end

  # it "view document should create a view_count" do
  #   document = Factory(:document)
  #   visit document_path(document)
  #   ViewCount.last.viewable.should == document
  # end

  # it "view document should create a view_count with currrent_user" do
  #   document = Factory(:document)
  #   sign_in_as_user
  #   visit document_path(document)
  #   view_count = ViewCount.last
  #   view_count.viewable.should == document
  #   view_count.user.should == @current_user
  # end
  
end