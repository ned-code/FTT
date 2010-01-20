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
    @media = Media.find_by_uuid(params[:id])
    #TODO temp check by id if not found by uuid
    if (!@media)
      @media = Media.find(params[:id])
    end
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
    @media = eval(params[:type]).new(:file => params[:file])
    
    if (params[:type] == 'Medias::Image')
      @media.user = current_user
    end
    @media.save
    redirect_to medias_path
  end

  # DELETE /medias/:id
  def destroy
    @media = Media.find_by_uuid(params[:id])
    @media.destroy
    
    redirect_to medias_path
  end

end