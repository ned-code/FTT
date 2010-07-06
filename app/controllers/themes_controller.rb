class ThemesController < ApplicationController
  # before_filter :authenticate_user!
  
  # GET /users
  def index
    @themes = Theme.last_version
    theme_json = @themes.map do |theme|
      cached_theme = Rails.cache.fetch("theme_#{theme.uuid}") do
        theme.as_json(:except => :file, :include => {:layouts => {:include => {:model_page => {:include => :items }}}})
      end
    end
    
    respond_to do |format|
      format.html
      format.json {render :json =>theme_json}
    end
  end
  
  # GET /users/:id
  def show
    if params[:id] == "default"
      @theme = Theme.default
      else
      @theme = Theme.find_by_uuid(params[:id])
      if !@theme
        @theme = Theme.find(params[:id])
      end
    end
    cached_theme = Rails.cache.fetch("theme_#{@theme.uuid}") do
      @theme.as_json(:except => :file, :include => {:layouts => {:include => {:model_page => {:include => :items }}}})
    end    
    render :json => cached_theme
  end
end