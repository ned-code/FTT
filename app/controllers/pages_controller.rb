class PagesController < ApplicationController
  permit 'registered'

  def show
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:document_id]) : UniboardDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_id(params[:id]) if @document
    #TODO how to get server url without request object?
    if (@page)
      @domain = "#{request.protocol}#{request.host_with_port}"
      @page_url =  @page.url("xhtml", @domain)
    end
    respond_to do |format|
      if @document && @page && permit?('owner of document')
        request_domain = "#{request.protocol}#{request.host_with_port}"
        format.html {
          #render :action => "show", :layout => false, :content_type => "application/xhtml+xml"
          redirect_to @page_url
        }
        format.xml { redirect_to @page.url("svg", request_domain) }
        format.json { 
          render :json => "{ 'url' : '#{@page_url}', 'previousId' : '#{@page.previous ? @page.previous.id : nil}' , 'nextId' : '#{@page.next ? @page.next.id : nil}'}"
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

end
