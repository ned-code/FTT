class DocumentController < ApplicationController
  before_filter :instantiate_document
  
private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id]) if params[:document_id]
  end
  
  def document_is_public?
    @document.public?
  end
  
end