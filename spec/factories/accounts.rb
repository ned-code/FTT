Factory.define :account do |account|
  account.sequence(:email) {|n| "email#{n}@test.com" }
  account.password 'test'
  account.password_confirmation 'test'
#  account.association_name {|a| a.association(:association_factory)}
end
