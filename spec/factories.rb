Factory.define :user do |f|
  f.sequence(:email)  { |n| "email#{n}@test.com" }
  f.password          '123456'
  f.username          { |n| "johndow#{n}" }
  f.first_name        'John'
  f.last_name         'Doe'
  f.terms_of_service  "1"
end

Factory.define :admin, :class => User do |f|
  f.sequence(:email)  { |n| "admin#{n}@test.com" }
  f.password          '123456'
  f.username          { |n| "admin#{n}" }
  f.first_name        'admin'
  f.last_name         'admin'
  f.terms_of_service  "1"
  f.after_build       { |user| user.has_role!("admin") }
end

Factory.define :admin_role, :class => Role do |f|
  f.name    "admin"
end

Factory.define :document do |f|
  f.title "Test Document"
  
  f.creator  { |f| f.association(:user)}
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

Factory.define :widget, :class => Medias::Widget do |f|
  f.file { File.open(Rails.root.join('spec','fixtures','widget.zip')) }
  f.system_name "widget"
end
