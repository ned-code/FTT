class DocumentRolesController < ApplicationController
  before_filter :find_document

  # GET /documents/:document_id/roles
  def show
    render :json => @document.to_access_json
  end
  
  # POST /documents/:document_id/roles
  def create
    authorize! :update, @document
    if @document.create_role_for_users(current_user, params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
  # PUT /documents/:document_id/roles
  def update
    authorize! :update, @document
    if @document.update_accesses(params[:accesses])
      render :json => @document.to_access_json
    else
      render :status => :error
    end
  end
  
  # DELETE /documents/:document_id/roles
  def destroy
    authorize! :update, @document
    @document.remove_role(current_user, params[:accesses])
    
    render :json => @document.to_access_json
  end

  private

  def find_document
    @document = Document.find_by_uuid(params[:document_id])
  end

  def find_pseudo_document
    @pseudo_document = Document.find(params[:document_id], :select => 'documents.uuid')
  end 
  
end