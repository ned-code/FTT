class CreatorsController < DocumentController
  before_filter :authenticate_user!
  
  # GET /documents/:document_id/creators
  def show
    render :json => @document.creator.to_json(:only => [:id, :username, :bio], :methods => [:avatar_thumb_url, :documents_count])
  end
  
end