pass = 'pass'
pass_hash = { :password => pass, :password_confirmation => pass}
User.create(pass_hash.merge(:name => "Julien", :email => "julien.bachmann@mnemis.com"))
User.create(pass_hash.merge(:name => "Yann", :email => "yann.ringgenberg@mnemis.com"))
User.create(pass_hash.merge(:name => "Stelio", :email => "stelio.tzonis@mnemis.com"))
User.create(pass_hash.merge(:name => "Zeno", :email => "zeno@jilion.com"))
User.create(pass_hash.merge(:name => "Guest", :email => "guest@mnemis.com"))
User.create(pass_hash.merge(:name => "David", :email => "david.matthey@mnemis.com"))
User.find_by_email("julien.bachmann@mnemis.com").has_role!("admin")
User.find_by_email("yann.ringgenberg@mnemis.com").has_role!("admin")
User.find_by_email("stelio.tzonis@mnemis.com").has_role!("admin")
User.find_by_email("david.matthey@mnemis.com").has_role!("admin")

User.create({:password => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :password_confirmation => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :name => "All", :email => "All@mnemis.com"})
