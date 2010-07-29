class DocumentController < ApplicationController
  #before_filter :instantiate_document
  before_filter :instantiate_pseudo_document
  
private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id])
  end
  
  def instantiate_pseudo_document
    @pseudo_document = Document.find(params[:document_id], :select => 'documents.uuid, documents.is_public')
  end  
  
end