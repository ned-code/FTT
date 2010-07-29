class DocumentController < ApplicationController
  #before_filter :instantiate_document
  before_filter :instantiate_pseudo_document
  
private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id])
  end
  
  def instantiate_pseudo_document
    @pseudo_document = Document.find_by_sql("select d.uuid, d.is_public from documents d where d.uuid = '#{params[:document_id]}';").first
  end  
  
end