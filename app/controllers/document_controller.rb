class DocumentController < ApplicationController
  before_filter :authenticate_user!
  before_filter :instantiate_document
  
private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id])
  end
  
end