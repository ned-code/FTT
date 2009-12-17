class ImagesController < ApplicationController
  before_filter :login_required
  
  # GET /images
  def index
    @images = current_user.images.paginate(:page => params[:page], :per_page => 50)
    
    respond_to do |format|
      format.html
      format.json { render :json => @images }
    end
  end
  
  # /images/:id
  def show
    @image = current_user.images.find(params[:id]) 
    
    respond_to do |format|
      format.html { redirect_to @image.file.url }
      format.json { render :json => @image }
    end
  end
  
  # POST /images
  def create
    @image = current_user.images.build(params[:image])
    
    if @image.save
      render :json => @image
    else
      render :status => 503
    end
  end
  
  # DELETE /images/:id
  def destroy
    @image = current_user.images.find(params[:id])
    @image.destroy
    
    head :ok
  end
  
end