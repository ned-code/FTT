class PagesController < ApplicationController
  permit 'registered'

  def show
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:document_id]) : UniboardDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_id(params[:id]) if @document

    respond_to do |format|
      if @document && @page && permit?('owner of document')
        format.xml { redirect_to @page.url }
      else
        format.xml { head :forbidden }
      end
    end
  end

end
