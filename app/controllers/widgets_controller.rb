class WidgetsController < ApplicationController
  before_filter :login_required
  
  # GET /widgets
  def index
    @widgets = Medias::Widget.paginate(:page => params[:page], :per_page => 50)
    
    respond_to do |format|
      format.html
      format.json { render :json => @widgets }
    end
  end
  
  # /widgets/:id
  def show
    @widget = Medias::Widget.find_by_uuid(params[:id])
    
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