class Facebook::PhotosController < ApplicationController

  # GET /facebook/albums/:album_id/images
  def index
    photos = current_user.facebook_request("/#{params[:album_id]}/photos")['data']
    photos_with_root = photos.blank? ? {:photos => {}} : {:photos => photos}
    render :json => photos_with_root
  end

end
