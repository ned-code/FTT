class DocumentRolesController < ApplicationController
  before_filter :find_document

  # GET /documents/:document_id/roles
  def show
    render :json => @document.to_access_json
  end
  
  # POST /documents/:document_id/roles
  def create
    if @document.create_role_for_users(current_user, params[:accesses])
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
    @document.remove_role(current_user, params[:accesses])
    
    render :json => {}
  end

  private

  def find_document
    @document = Document.find_by_uuid(params[:document_id])
  end

  def find_pseudo_document
    @pseudo_document = Document.find(params[:document_id], :select => 'documents.uuid, documents.is_public')
  end 
  
end