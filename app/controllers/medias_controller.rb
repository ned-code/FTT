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
  
  # GET /medias/new
  def new
  end
    
  # POST /medias
  def create
    new_media = eval(params[:type]).create(:file => params[:file])
    #Horrible hack because I dont know why type is wrong when media is created.
    new_media.type = params[:type]
    new_media.save
    redirect_to medias_path
  end

  # DELETE /medias/:id
  def destroy
    @media = Media.find(params[:id])
    @media.destroy
    
    redirect_to medias_path
  end

end