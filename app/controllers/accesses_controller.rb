class AccessesController < DocumentController
  before_filter :authenticate_user!
  
  # GET /documents/:document_id/accesses
  def show
    render :json => @document.to_access_json
  end
  
  # POST /documents/:document_id/accesses
  def create
    if @document.create_accesses(params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
  # PUT /documents/:document_id/accesses
  def update
    if @document.update_accesses(params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
end