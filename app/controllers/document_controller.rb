class DocumentController < ActionController::Base
  before_filter :instantiate_document
  
private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id])
  end
  
end