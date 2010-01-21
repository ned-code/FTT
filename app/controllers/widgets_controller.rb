class WidgetsController < ApplicationController
  before_filter :login_required
  
  # GET /widgets
  def index
    if (params[:system_widget_name])
      @widgets = Medias::Widget.find_by_system_name(params[:system_widget_name])
    else
      # index retunr only widget that are not system widget.
      @widgets = Medias::Widget.paginate(:page => params[:page], :per_page => 50, :conditions => "system_name is null")
    end
    
    
    respond_to do |format|
      format.json { render :json => @widgets }
    end
  end
  
  # /widgets/:id
  def show
    @widget = Medias::Widget.find_by_uuid(params[:id])
    #TODO temp check by id if not found by uuid
    if (!@widget)
      @widget = Medias::Widget.find(params[:id])
    end

    respond_to do |format|
      format.html { redirect_to @widget.file.url }
      format.json { render :json => @widget }
    end
  end
  
  # POST /widgets
  def create
    @widget = Medias::Widget.new(params[:widget])
    
    if @widget.save
      render :json => @widget
    else
      render :status => 503
    end
  end
  
  # DELETE /widgets/:id
  def destroy
    @widget = Medias::Widget.find_by_uuid(params[:id])
    @widget.destroy
    
    head :ok
  end
  
end