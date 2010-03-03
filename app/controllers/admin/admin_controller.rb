class Admin::AdminController < ApplicationController
  before_filter :admin_required
  
private
  
  def admin_required
    redirect_to root_path unless user_signed_in? && current_user.has_role?("admin")
  end
  
end