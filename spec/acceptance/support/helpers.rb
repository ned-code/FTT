module HelperMethods
  # Put here any helper method you need to be available in all your acceptance tests
  
  def warden
    request.env['warden']
  end
  
  def create_user(options={})
    @current_user ||= begin
      user = Factory(:user, options)
      user.confirm! unless options[:confirm] == false
      user.lock! if options[:locked] == true
      user
    end
  end
  
  # def create_admin(options={})
  #   @admin ||= begin
  #     admin = Admin.create!(
  #       :email => 'admin@test.com', :password => '123456', :password_confirmation => '123456'
  #     )
  #     admin
  #   end
  # end
  
  def sign_in_as_user(options={}, &block)
    user = create_user(options)
    visit homepage unless options[:visit] == false
    fill_in 'user_email', :with => user.email
    fill_in 'user_password', :with => '123456'
    check 'remember me' if options[:remember_me] == true
    yield if block_given?
    click_button 'Login'
    user
  end
  
  # def sign_in_as_admin(options={}, &block)
  #   admin = create_admin(options)
  #   visit new_admin_session_path unless options[:visit] == false
  #   fill_in 'email', :with => 'admin@test.com'
  #   fill_in 'password', :with => '123456'
  #   yield if block_given?
  #   click_button 'Sign In'
  #   admin
  # end
  
  # Fix assert_redirect_to in integration sessions because they don't take into
  # account Middleware redirects.
  #
  def assert_redirected_to(url)
    assert [301, 302].include?(@integration_session.status),
           "Expected status to be 301 or 302, got #{@integration_session.status}"
    
    url = prepend_host(url)
    location = prepend_host(@integration_session.headers["Location"])
    assert_equal url, location
  end
  
protected
  
  def prepend_host(url)
    url = "http://#{request.host}#{url}" if url[0] == ?/
    url
  end
    
end

Spec::Runner.configuration.include(HelperMethods)


