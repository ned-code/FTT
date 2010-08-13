class Admin::ThemesController < Admin::AdminController
  
  before_filter :find_theme, :only => [:show, :edit, :update, :destroy]

  def index
    @themes = Theme.last_version
  end

  def show

  end

  def new
    @theme = Theme.new
  end

  def create
    @theme = Theme.new(params[:theme])

    if @theme.set_attributes_from_config_file_and_save
      respond_to do |format|
        format.html { redirect_to admin_theme_path(@theme) }
        format.json { render :json => @theme }
      end
    else
      flash[:failure] = t('flash.notice.theme.created_failed')
      render :new
    end
  end

  def edit
  end

  def update
    @updated_theme = Theme.new(params[:theme])

    if @updated_theme.set_attributes_from_config_file_and_save(@theme)
      flash[:notice] = t("flash.notice.theme.update_successful")
      redirect_to admin_theme_path(@updated_theme)
    else
      flash[:failure] = t('flash.notice.theme.updated_failed')
      for on, error in @updated_theme.errors
        @theme.errors.add(on, error)
      end
      render :edit
    end
  end

  def destroy
    @theme.destroy_with_all_ancestors

    flash[:notice] = t('flash.notice.theme.destroyed_successful')
    redirect_to admin_themes_path
  end

  private

  def find_theme
    @theme = Theme.find_by_uuid(params[:id]) if params[:id]
  end
  

end
