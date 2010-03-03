# Default categories creation
["Activism & Non Profits", "Art", "Books", "Business", "Education", "Entertainment", "Everyday life", "Health & Medicine", "History", "Movies", "News", 
"Travel", "Products", "Photos", "Politics", "Spiritual", "Sports", "Technology", "Travel", "Other"].each do |category_name|
  unless Category.find_by_name(category_name)
    Category.create(:name => category_name)
    puts "Created category: #{category_name}"
  end
end
