class DocumentRolesController < DocumentController
  before_filter :authenticate_user!
  
  # GET /documents/:document_id/roles
  def show
    render :json => @document.to_access_json
  end
  
  # POST /documents/:document_id/roles
  def create
    if @document.create_role_for_users(params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
  # PUT /documents/:document_id/roles
  def update
    if @document.update_accesses(params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
  # DELETE /documents/:document_id/roles
  def destroy
    @document.remove_role(params[:accesses])
    
    render :json => {}
  end
  
  
end