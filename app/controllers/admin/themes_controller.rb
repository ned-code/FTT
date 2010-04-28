class Admin::ThemesController < ApplicationController

  before_filter :find_theme, :only => [:show, :destroy]

  def index
    @themes = Theme.all
  end

  def show

  end

  def new
    @theme = Theme.new
  end

  def create
    @theme = Theme.new(params[:theme])

    if @theme.save
      @theme.create_layout_model_pages!
      respond_to do |format|
        format.html { redirect_to admin_theme_path(@theme) }
        format.json { render :json => @theme }
      end
    else
      render :new
    end
  end

  def destroy
    @theme.destroy

    flash[:notice] = t('flash.notice.theme.destroyed_successful')
    redirect_to admin_themes_path
  end

  private

  def find_theme
    @theme = Theme.find_by_uuid(params[:id]) if params[:id]
  end
  

end
