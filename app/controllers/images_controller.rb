class ImagesController < ApplicationController
  before_filter :login_required
  
  # GET /images
  def index
    per_page = 12
    @images = current_user.images.paginate(:page => params[:page], :per_page => per_page)

    respond_to do |format|
      format.html
      format.json { render :json => { 
        :images => @images,
        :pagination => {
          :per_page => per_page,
          :current_page => @images.current_page,
          :next_page => @images.next_page,
          :previous_page => @images.previous_page,
          :total => @images.total_entries }
        }
      }
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
    sleep 1 #TODO REMOVE THIS
    
    @image = current_user.images.build(params[:image])
    @image.uuid = params[:image][:uuid]
    
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