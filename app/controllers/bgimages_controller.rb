class BgimagesController < ApplicationController
  
  # POST /medias
  def create
    @image = Medias::Image.new(:file => params[:image])
    @image.user = current_user
      
    @image.save
    respond_to do |format|
      format.html { render :json => @image } 
      format.json { render :json => @image }
    end
  end

end