namespace :users do
  task :add_dev => :environment do
    users = [
      {:username => 'admin',  :email => "admin@mnemis.com", :pass => '123456'},
      {:username => 'guest',  :email => "guest@mnemis.com", :pass => '123456'},
      
      {:username => 'all',    :email => "all@mnemis.com",   :pass => 'ycfeIDHUFvSzxXowiKZj'}
    ]
    users.each do |user|
      unless User.find_by_username(user[:username])
        user = User.create(
          :email            => user[:email],
          :password         => user[:pass],
          :username         => user[:username],
          :first_name       => user[:username],
          :last_name        => user[:username],
          :terms_of_service => "1"
        )
        user.update_attribute(:confirmed_at, Time.now.utc) # Auto confirmation
        puts "Created user: #{user[:username]}"
      end
    end
    User.find_by_username("admin").has_role!("admin")
  end
  
  task :confirm_all => :environment do
    User.update_all "confirmed_at = '#{Time.now.utc.to_s(:db)}'", :confirmed_at => nil
  end
  
  task :fix_roles => :environment do
    default_user = User.find(:first)
    Document.all.each do |document|
      if (document.creator)
        document.creator.has_role!("editor", document)
      else
       document.creator = default_user
       document.save
       default_user.has_role!("editor", document)
      end      
    end
  end  
  
end