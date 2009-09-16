module NavigationHelpers
  def path_to(page_name)
    case page_name
    
    when /the homepage/
      root_path
    when /new user page/
      new_user_path
    when /users page/
      users_path
    when /documents page/
      documents_path
    when /login page/
      login_path

    # Add more page name => path mappings here
    
    else
      raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
        "Now, go and add a mapping in features/support/paths.rb"
    end
  end
end
World(NavigationHelpers)
