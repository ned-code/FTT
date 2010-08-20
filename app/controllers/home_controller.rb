class HomeController < ApplicationController

  skip_before_filter :authenticate_user!

  before_filter :redirect_if_user_signed_in
  
  def show
    set_return_to
    @user = User.new
    #TODO uncomment this line if you want to have top documents on home page
    #@top_documents = Document.all_public_paginated_with_explore_params("recent", "all", nil, 4)
  end
  
private
  
  def redirect_if_user_signed_in
    redirect_to dashboard_path if user_signed_in?
  end
  
end
