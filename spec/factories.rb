Factory.define :user do |f|
  f.sequence(:email)  {|n| "email#{n}@test.com" }
  f.password          '123456'
  f.username          'johndoe'
  f.first_name        'John'
  f.last_name         'Doe'
  f.terms_of_service  "1"
end

Factory.define :document do |f|
  f.title "Test Document"
end

Factory.define :page do |f|
  f.document { |f| f.association(:document)}
  f.sequence(:position) { |n| n }
end

Factory.define :item do |f|
  f.page { |f| f.association(:page)}
  f.media { |f| f.association(:media)}
end

Factory.define :media do |f|
end