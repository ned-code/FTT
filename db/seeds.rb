users = [
  {:name => 'Admin', :email => "admin@mnemis.com", :pass => 'pass'},
  {:name => 'Guest',   :email => "guest@mnemis.com", :pass => 'pass'},
]

users.each do |user|
  unless User.find_by_name(user[:name])
    pass_hash = { :password => user[:pass], :password_confirmation => user[:pass]}
    User.create(pass_hash.merge(:name => user[:name], :email => user[:email]))
    puts "Created user: #{user[:name]}"
  end
end

User.find_by_email("admin@mnemis.com").has_role!("admin")
User.find_by_email("guest@mnemis.com").has_role!("admin")

# Default categories creation
["Activism & Non Profits", "Art", "Books", "Business", "Education", "Entertainment", "Everyday life", "Health & Medicine", "History", "Movies", "News", 
"Travel", "Products", "Photos", "Politics", "Spiritual", "Sports", "Technology", "Travel"].each do |category_name|
  unless Category.find_by_name(category_name)
    Category.create(:name => category_name)
    puts "Created category: #{category_name}"
  end
end