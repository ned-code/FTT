class MediasController < ApplicationController
  before_filter :login_required
  
  # GET /medias
  def index
    
    respond_to do |format|
      format.html { @medias = Media.all}
      format.json {
        @medias = Media.find_all_by_type(params[:type])
        @medias.each do |media|
          media[:thumb_url] = media.file.url(:thumb)
          media[:url] = media.file.url
        end
        render :json => @medias
      }
    end
    
  end
  
  # GET /medias/new
  def new
  end
    
  # POST /medias
  def create
    eval(params[:type]).create(:file => params[:file])
    
    redirect_to medias_path
  end

  # DELETE /medias/:id
  def destroy
    @media = Media.find(params[:id])
    @media.destroy
    
    redirect_to medias_path
  end

end