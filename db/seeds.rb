pass = 'pass'
pass_hash = { :password => pass, :password_confirmation => pass}
User.create(pass_hash.merge(:name => "Julien", :email => "julien.bachmann@mnemis.com"))
User.create(pass_hash.merge(:name => "Yann", :email => "yann.ringgenberg@mnemis.com"))
User.create(pass_hash.merge(:name => "Stelio", :email => "stelio.tzonis@mnemis.com"))
User.create(pass_hash.merge(:name => "Zeno", :email => "zeno@jilion.com"))