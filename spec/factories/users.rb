Factory.define :user do |user|
  user.sequence(:email) {|n| "email#{n}@test.com" }
  user.password 'test'
  user.password_confirmation 'test'
#  user.association_name {|a| a.association(:association_factory)}
end

Factory.define :confirmed_user, :parent => :user do |user|
  user.confirmed true
end