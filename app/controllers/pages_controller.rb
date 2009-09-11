require 'json'

class PagesController < ApplicationController
  permit "registered"
  
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
#    #TODO how to get server url without request object?
#    if (@page)
#      @page_url =  @page.url("application/xhtml+xml")
#    end
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.json {
          render :json => "{ 'url' : '#{url_for :controller => 'pages',  :action => 'content', :id => @page.id, :document_id => @document.id }', 'previousId' : '#{@page.previous ? @page.previous.id : nil}' , 'nextId' : '#{@page.next ? @page.next.id : nil}'}"
#        render :json => "{ 'url' : '#{@page.media.get_resource('application/xhtml+xml').public_url }', 'previousId' : '#{@page.previous ? @page.previous.id : nil}' , 'nextId' : '#{@page.next ? @page.next.id : nil}'}"
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

  def update
    current_page = UbPage.find_by_id(params[:id])
    action = params[:ubAction]
    data = JSON.parse(params[:ubData])
    message = {}
    if (action == 'clear')
      current_page.page_elements.find_all_by_element_type('polyline').each { |a_page_element| a_page_element.destroy()}
    else
      existing_page_element = current_page.page_elements.find_by_uuid(data['uuid'])
      if (action == 'overwrite')
        #update model
        if (existing_page_element.nil?)
          existing_page_element = current_page.page_elements.create(:data => data.to_json, :uuid => data['uuid'], :element_type => data['tag']);
        else
          existing_page_element.data = data.to_json
          existing_page_element.save
        end
      elsif (action == 'remove')
        unless (existing_page_element.nil?)
          existing_page_element.destroy
        end
      end
    end
    render :nothing => true
  end

  def content
    @document = params[:document_id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:document_id]) : UbDocument.find_by_id(params[:document_id])
    @page = params[:id] =~ UUID_FORMAT_REGEX ? @document.pages.find_by_uuid(params[:id]) : @document.pages.find_by_position(params[:id]) if @document

    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.json {
          render :json => @page.json_content
        }
      else
        format.json {
          render :json => "{}"
        }
      end
    end
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
          render :action => "showproto", :layout => false, :content_type => "application/xhtml+xml"
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end

  def orbited_javascript
    [
      "<script type=\"text/javascript\" src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/Orbited.js\"></script>",
      '<script type="text/javascript">',
      '  document.domain = document.domain;',
      '  var Orbited;',
      "  if (Orbited) {",
      "    Orbited.settings.port = #{APP_SETTINGS[:orbited_port]};",
      "    Orbited.settings.hostname = '#{APP_SETTINGS[:orbited_host]}';",
      '     TCPSocket = Orbited.TCPSocket;',
      '   }',
      "  var AUTH_TOKEN = \"#{protect_against_forgery? ? form_authenticity_token : ''}\";",
      "  $.ajaxSetup({data:{authenticity_token : AUTH_TOKEN}});",
      '</script>',
      "<script src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/protocols/stomp/stomp.js\"></script>"
    ].join("\n")
  end
  
end
