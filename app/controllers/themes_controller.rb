class ThemesController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /users
  def index
    @themes = Theme.all
    render :json => @themes.to_json(:except => :file, :include => {:layouts => {:include => {:model_page => {:include => :items }}}})
  end
  
  # GET /users/:id
  def show
    @theme = Theme.find_by_uuid(params[:id])
    if !@theme
      @theme = Theme.find(params[:id])
    end
    render :json => @theme.to_json(:except => :file, :include => {:layouts => {:include => {:model_page => {:include => :items }}}})
  end
  
end