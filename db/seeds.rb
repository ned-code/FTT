pass = 'pass'
pass_hash = { :password => pass, :password_confirmation => pass}
User.create(pass_hash.merge(:name => "Julien", :email => "julien.bachmann@mnemis.com"))
User.create(pass_hash.merge(:name => "Yann", :email => "yann.ringgenberg@mnemis.com"))
User.create(pass_hash.merge(:name => "Stelio", :email => "stelio.tzonis@mnemis.com"))
User.create(pass_hash.merge(:name => "Zeno", :email => "zeno@jilion.com"))
User.create(pass_hash.merge(:name => "Guest", :email => "guest@mnemis.com"))

media = Media.new({:file_file_name => "GoogleMap.wgt.zip", :file_content_type => "application/wgt"})
media[:uuid] = "2f499bf0-9574-012c-72fc-002500a8be1c"
media[:type] = "Medias::Widget"
media.save
media = Media.new({:file_file_name => "CountDown.wgt.zip", :file_content_type => "application/wgt"})
media[:uuid] = "2589c210-9574-012c-72fc-002500a8be1c"
media[:type] = "Medias::Widget"
media.save
media = Media.new({:file_file_name => "VideoPicker.wgt.zip", :file_content_type => "application/wgt"})
media[:uuid] = "7f096ba0-994e-012c-72ff-002500a8be1c"
media[:type] = "Medias::Widget"
media.save