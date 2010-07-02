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

end

feature "Login" do

  scenario "should be able to login" do
    sign_in_as_user(:email => "john@doe.com")
    page.should have_content("john@doe.com")
    page.should have_content("logout")
  end

end

feature "Register" do

  it "should be possible to register" do
    visit homepage
    click_link "sign up"
    fill_in "user_email",      :with => "john@doe.com"
    fill_in "user_first_name", :with => "John"
    fill_in "user_last_name",  :with => "Doe"
    fill_in "user_username",   :with => "johndoe"
    fill_in "user_password",   :with => "123456"
    check "user_terms_of_service"
    click_button "user_submit"
    page.should have_content("You have signed up successfully.")
    page.should have_content("john@doe.com")
    page.should have_content("logout")
    URI.parse(current_url).path.should == "/documents"
    # save_and_open_page
  end
  
end