class ImagesController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /images
  def index
    per_page = 100
    @images = current_user.images.paginate(:page => params[:page], :per_page => per_page, :conditions => { :favorites => params[:favorites] })
    
    respond_to do |format|
      format.json { render :json => { 
        :images => @images,
        :pagination => {
          :per_page => per_page,
          :current_page => @images.current_page,
          :total_pages => @images.total_pages, 
          :next_page => @images.next_page,
          :previous_page => @images.previous_page,
          :total => @images.total_entries }
        }
      }
    end
  end
  
  # /images/:id
  def show
    @image = current_user.images.find_by_uuid(params[:id])
    
    respond_to do |format|
      format.html { redirect_to @image.file.url }
      format.json { render :json => @image }
    end
  end
  
  # POST /images
  def create
    @image = current_user.images.build(params[:image])
    @image.uuid = params[:image][:uuid]
    @image.favorites = params[:image][:favorites]
    @image.fix_content_type_for_swfupload!

    respond_to do |format|
      if @image.save
        format.json { render :json => @image }
      else
        format.json { render :json => @image, :status => 500 }
      end
    end
  end
  
  # DELETE /images/:id
  def destroy
    @image = current_user.images.find_by_uuid(params[:id])
    @image.destroy
    
    head :ok
  end
  
  #no authentication for images as SWFUpload does not like it so much
  def http_authenticate
  end
    
end