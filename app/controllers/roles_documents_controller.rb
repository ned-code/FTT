class RolesDocumentsController < ApplicationController
  before_filter :authenticate_user!
  
  #GET /roles/documents
  def index
    @roles = Role.all_by_user_document_ids_grouped_by_name(current_user)
    respond_to do |format|
      format.json { render :json => @roles }
    end
  end
  
end