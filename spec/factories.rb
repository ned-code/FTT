Factory.define :user do |f|
  f.sequence(:email) {|n| "email#{n}@test.com" }
  f.password 'test'
  f.password_confirmation 'test'
  f.name 'bob'
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
  f.path 'test/test'
  f.mime_type "image/jpeg"
  f.version 0
end

Factory.define :conversion do |f|
  f.path 'test/test'
  f.mime_type "image/jpeg"
  f.media { |f| f.association(:media)}
end
