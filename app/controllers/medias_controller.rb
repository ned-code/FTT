class MediasController < ApplicationController
  before_filter :login_required
  
  # GET /medias
  def index
    @medias = Media.complex_find(params)
    
    respond_to do |format|
      format.html
      format.json { render :json => @medias }
    end
  end
  
  def show
    @media = Media.find(params[:id]) 
    
    respond_to do |format|
      format.html { redirect_to @media.file.url }
      format.json { render :json => @media }
    end    
  end
  
  # GET /medias/new
  def new
  end
    
  # POST /medias
  def create
    new_media = eval(params[:type]).create(:file => params[:file])
    redirect_to medias_path
  end

  # DELETE /medias/:id
  def destroy
    @media = Media.find(params[:id])
    @media.destroy
    
    redirect_to medias_path
  end

end