require 'stomp'
class PagesController < ApplicationController

  def show
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:document_id]) : UbDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_id(params[:id]) if @document
    
    if (@page)
      @page_url =  @page.url("application/xhtml+xml")
    end
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.html {
          user_agent = request.env['HTTP_USER_AGENT'].downcase
          # ie does not support xhtml. So we render html
          if user_agent =~ /msie/i
            render :action => "show", :layout => false, :content_type => "text/html"
          else
            render :action => "show", :layout => false, :content_type => "application/xhtml+xml"
          end

          #redirect_to @page_url
        }
        format.xml {
          permit 'registered'
          redirect_to @page.url
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

  def info
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:document_id]) : UbDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_id(params[:id]) if @document
    #TODO how to get server url without request object?
    if (@page)
      @page_url =  @page.url("application/xhtml+xml")
    end
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.json {
          render :json => "{ 'url' : '#{@page_url}', 'previousId' : '#{@page.previous ? @page.previous.id : nil}' , 'nextId' : '#{@page.next ? @page.next.id : nil}'}"
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

  def update
    s = Stomp::Client.new
    s.send(params[:ubChannel],params[:ubData])
    s.close
    render :nothing => true
  end
  
  def proto
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:document_id]) : UbDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_id(params[:id]) if @document
    #TODO how to get server url without request object?
    if (@page)
      @page_url =  @page.url("application/xhtml+xml")
    end
    @domain = request.protocol + request.host_with_port
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.html {
          @orbited_js = orbited_javascript
          render :action => "showproto", :layout => false, :content_type => "application/xhtml+xml"
          #redirect_to @page_url
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

end
