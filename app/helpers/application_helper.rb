module ApplicationHelper

  def get_return_to
    session[:return_to] || root_path
  end

end