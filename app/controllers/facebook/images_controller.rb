class Facebook::ImagesController < ApplicationController

  # GET /facebook/images
  def index
    images_json = {}
    albums = current_user.facebook_request('/me/albums')['data']
    for album in albums
      images_json[album] = []
      photos = current_user.facebook_request("/#{album['id']}/photos")['data']
      for photo in photos
        images_json[album] << photo
      end
    end
    p images_json
    render :json => images_json
  end

end
