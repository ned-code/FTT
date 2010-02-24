class HomeController < ApplicationController
  before_filter :redirect_if_user_signed_in
  
  def show
    @user = User.new
  end
  
private
  
  def redirect_if_user_signed_in
    redirect_to documents_path if user_signed_in?
  end
  
end
