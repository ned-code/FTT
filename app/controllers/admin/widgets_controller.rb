class Admin::WidgetsController < Admin::AdminController

  # GET /admin/apps
  def index
    @widgets = Medias::Widget.all
    
    respond_to do |format|
      format.html
      format.json { render :json => @widgets }
    end
  end
  
  # GET /admin/apps/new
  def new
    @widget = Medias::Widget.new
  end
  
  # POST /admin/apps
  def create
    @widget = Medias::Widget.new(params[:medias_widget])
    
    if @widget.save
      respond_to do |format|
        format.html { redirect_to admin_widgets_path }
        format.json { render :json => @widget }
      end
    else
      flash[:notice] = t("flash.notice.widget.#{@widget.status}") if @widget.status      
      render :new
    end
  end
  
  
  # GET /admin/apps/:id/edit
  def edit
    @widget = Medias::Widget.find_by_uuid(params[:id])
  end
  
  # PUT /admin/apps/:id
  def update
    @widget = Medias::Widget.find_by_uuid(params[:id])
    
    if @widget.update_attributes(params[:medias_widget])
      flash[:notice] = t("flash.notice.widget.#{@widget.status}") if @widget.status
      redirect_to admin_widgets_path
    else
      flash[:failure] = t('flash.notice.widget.updated_failed')
      render :edit
    end
  end
  
  # DELETE /admin/apps/:id
  def destroy
    @widget = Medias::Widget.find_by_uuid(params[:id])
    @widget.destroy
    
    flash[:notice] = t('flash.notice.widget.destroyed_successful')
    redirect_to admin_widgets_path
  end

end