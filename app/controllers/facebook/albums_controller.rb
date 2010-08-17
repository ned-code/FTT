class Facebook::AlbumsController < ApplicationController

  # GET /facebook/albums
  def index
    albums = current_user.facebook_request('/me/albums')['data']
    albums_with_root = albums.blank? ? {:albums => {}} : {:albums => albums}
    render :json => albums_with_root
  end

end
