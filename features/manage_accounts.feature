Feature: Manage accounts
  
  Scenario: Register new account
    Given I am on the new account page
    When I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I fill in "password confirmation" with "test"
    And I press "Create"
    Then I should see "test.cucumber@test.com"
    And I should receive an email
    When I open the email
    Then I should see "confirm" in the email
    When I follow "confirm" in the email
    Then I should see "confirmed"

  Scenario: Delete account
    Given the following accounts:
      |email|
      |test1.cucumber@test.com|
      |test2.cucumber@test.com|
      |test3.cucumber@test.com|
      |test4.cucumber@test.com|
    When I delete the 3rd account
    Then I should see the following accounts:
      |email|
      |test1.cucumber@test.com|
      |test2.cucumber@test.com|
      |test4.cucumber@test.com|

  Scenario: Login with activated account
    Given the following accounts:
      |email|password|password_confirmation|active|
      |test.cucumber@test.com|test|test|true|
    When I go to the login page
    And I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I press "Login"
    Then I go to the accounts page

  Scenario: Login with unactivated account
    Given the following accounts:
      |email|password|password_confirmation|
      |test.cucumber@test.com|test|test|
    When I go to the login page
    And I fill in "email" with "test.cucumber@test.com"
    And I fill in "password" with "test"
    And I press "Login"
    Then I should see "Your account is not active"
