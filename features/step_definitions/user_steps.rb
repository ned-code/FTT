Given /^the following users:$/ do |users|
  users.hashes.each do |user|
    Factory.create(:user, user)
  end
end

When /^I am logged in with an (\w+) user$/ do |role|
  user = Factory.create(:user)
  user.confirm!
  user.send("is_#{role}")
#  UserSession.create(user)
  When "I go to the login page"
  And "I fill in \"email\" with \"#{user.email}\""
  And "I fill in \"password\" with \"#{user.password}\""
  And "I press \"Login\""
end

When /^I delete the (\d+)(?:st|nd|rd|th) user/ do |pos|
  visit users_url
  within("table > tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following users:$/ do |users|
  users.rows.each_with_index do |row, i|
    row.each_with_index do |cell, j|
      response.should have_selector("table > tr:nth-child(#{i+2}) > td:nth-child(#{j+1})") { |td|
        td.inner_text.should == cell
      }
    end
  end
end
