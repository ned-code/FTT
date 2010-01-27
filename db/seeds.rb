users = [
  {:name => 'Julien', :email => "julien.bachmann@mnemis.com", :pass => 'pass'},
  {:name => 'Yann',   :email => "yann.ringgenberg@mnemis.com", :pass => 'pass'},
  {:name => 'Stelio', :email => "stelio.tzonis@mnemis.com",   :pass => 'pass'},
  {:name => 'David',  :email => "david.matthey@mnemis.com",   :pass => 'pass'},
  {:name => 'Zeno',   :email => "zeno@jilion.com",            :pass => 'pass'},
  {:name => 'Stephen', :email => "stephen.band@mnemis.com",    :pass => 'pass'},
  {:name => 'Luc', :email => "luc.devallonne@mnemis.com",    :pass => 'pass'},
  {:name => 'Cedric', :email => "cedric.michelet@icare.info",    :pass => 'pass'},
  
  {:name => 'Guest',  :email => "guest@mnemis.com",           :pass => 'pass'},
  {:name => 'All',    :email => "All@mnemis.com",             :pass => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd'}
]

users.each do |user|
  unless User.find_by_name(user[:name])
    pass_hash = { :password => user[:pass], :password_confirmation => user[:pass]}
    User.create(pass_hash.merge(:name => user[:name], :email => user[:email]))
    puts "Created user: #{user[:name]}"
  end
end

User.find_by_email("julien.bachmann@mnemis.com").has_role!("admin")
User.find_by_email("yann.ringgenberg@mnemis.com").has_role!("admin")
User.find_by_email("stelio.tzonis@mnemis.com").has_role!("admin")
User.find_by_email("david.matthey@mnemis.com").has_role!("admin")
User.find_by_email("luc.devallonne@mnemis.com").has_role!("admin")