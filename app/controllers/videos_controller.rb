class VideosController < ApplicationController

  before_filter :login_required
  
  # GET /videos
  def index
    per_page = 5
    @videos = current_user.videos.paginate(:page => params[:page], :per_page => per_page)

    respond_to do |format|
      format.html
      format.json { render :json => { 
        :videos => @videos,
        :pagination => {
          :per_page => per_page,
          :current_page => @videos.current_page,
          :total_pages => @videos.total_pages, 
          :next_page => @videos.next_page,
          :previous_page => @videos.previous_page,
          :total => @videos.total_entries }
        }
      }
    end
  end
  
  # # /videos/:id
  # def show
  #   @video = current_user.videos.find_by_uuid(params[:id])
  #   
  #   respond_to do |format|
  #     format.html { redirect_to @video.file.url }
  #     format.json { render :json => @video }
  #   end
  # end
  
  # POST /videos
  def create
    @video = current_user.videos.build(params[:video])
    @video.uuid = params[:video][:uuid]
    
    if @video.save
      render :json => @video
    else
      render :status => 503
    end
  end
  
  # DELETE /videos/:id
  def destroy
    @video = current_user.videos.find_by_uuid(params[:id])
    @video.destroy
    
    head :ok
  end


end
