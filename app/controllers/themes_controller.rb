class ThemesController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /users
  def index
    @themes = Theme.all
    render :json => @themes.to_json
  end
  
  # GET /users/:id
  def show
    @theme = Theme.find_by_uuid(params[:id])
    render :json => @theme.to_json
  end
  
end