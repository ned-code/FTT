module AuthenticatedSystem
  
  # available as ActionView helper methods.
  def self.included(base)
    base.send :helper_method, :current_user, :current_session
  end
  
private
  
  def current_session
    return @current_session if defined?(@current_session)
    @current_session = UserSession.find
  end
  
  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_session.try(:user)
  end
  
  def store_location
    session[:return_to] = request.request_uri
  end
  
  def redirect_back_or_default(default = root_path)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end
  
  def logout
    current_session.try(:destroy)
    @current_user = @current_session = nil
  end
  
  def login(user)
    UserSession.create(user)
  end
  
  # Override this method for special conditions
  def authorized?
    current_user.present?
  end
  
  def login_required
    authorized? || access_denied
  end
  
  def access_denied
    respond_to do |format|
      format.html do
        store_location
        redirect_to login_path
      end
      format.xml { request_http_basic_authentication 'Web Password' }
    end
    false
  end
  
end