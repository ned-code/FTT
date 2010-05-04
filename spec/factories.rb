Factory.define :user do |f|
  f.sequence(:email)    { |n| "email#{n}@test.com" }
  f.password            '123456'
  f.sequence(:username) { |n| "johndow#{n}" }
  f.first_name          'John'
  f.last_name           'Doe'
  f.terms_of_service    "1"
end

Factory.define :admin, :class => User do |f|
  f.sequence(:email)    { |n| "admin#{n}@test.com" }
  f.password            '123456'
  f.sequence(:username) { |n| "admin#{n}" }
  f.first_name          'admin'
  f.last_name           'admin'
  f.terms_of_service    "1"
  f.after_build         { |user| user.has_role!("admin") }
end

Factory.define :admin_role, :class => Role do |f|
  f.name    "admin"
end

Factory.define :document do |f|
  f.title       "Test Document"
  f.is_public   true
  
  f.creator     { |f| f.association(:user)}
end

Factory.define :page do |f|
  f.document            { |f| f.association(:document) }
  f.sequence(:position) { |n| n }
end

Factory.define :item do |f|
  f.page    { |f| f.association(:page) }
  f.media   { |f| f.association(:media) }
end

Factory.define :media do |f|
  f.sequence(:system_name) { |n| "system_name#{n}" }
end

Factory.define :widget, :class => Medias::Widget do |f|
  f.file { File.open(Rails.root.join('spec','fixtures','widget.zip')) }
  #f.system_name "widget"
  f.sequence(:system_name) { |n| "widget#{n}" }
end

Factory.define :datastore_entry do |f|
  f.ds_key        "vote"
  f.ds_value      1
  f.item          { |f| f.association(:item) }
  f.user          { |f| f.association(:user) }
end

Factory.define :view_count do |f|
  f.session_id    "fake"
  f.ip_address    "127.0.0.1"
  f.viewable     { |f| f.association(:document) }
end

Factory.define :category do |f|
  f.sequence(:name) { |n| "category#{n}" } 
end

Factory.define :layout do |f|
  f.name            "Layout 1"
  f.thumbnail_url   Rails.root.join('spec','fixtures','thumbnail.png')
  f.template_url    Rails.root.join('spec','fixtures','layout.html')
end
