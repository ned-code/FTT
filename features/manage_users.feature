Feature: Manage users
  
  Scenario: Register new user
    Given I am on the new user page
    When I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I fill in "password confirmation" with "test"
    And I fill in "firstname" with "John"
    And I fill in "lastname" with "Doe"
    And I press "Create"
    Then I should see "registered"
    And I should receive an email
    When I open the email
    And I follow "confirm" in the email
    Then I should see "confirmed"
    And I should receive an email

  Scenario: Delete user
    Given the following users:
      |email|
      |test1.cucumber@test.com|
      |test2.cucumber@test.com|
      |test3.cucumber@test.com|
      |test4.cucumber@test.com|
    When I am logged in with an administrator user
    And I delete the 3rd user
    Then I should see the following users:
      |email|
      |test1.cucumber@test.com|
      |test2.cucumber@test.com|
      |test4.cucumber@test.com|

  Scenario: Login with confirmed user
    Given the following users:
      |email|password|password_confirmation|confirmed|
      |test.cucumber@test.com|test|test|true|
    When I go to the login page
    And I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I press "Login"
    Then I go to the users page

  Scenario: Login with unconfirmed user
    Given the following users:
      |email|password|password_confirmation|
      |test.cucumber@test.com|test|test|
    When I go to the login page
    And I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I press "Login"
    Then I should see "Your account is not confirmed"
