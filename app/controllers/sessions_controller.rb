class SessionsController < ApplicationController
  
  # GET /user
  def show
    render :json => current_user ? current_user.to_social_panel_json(current_user) : "{}"
  end

end
