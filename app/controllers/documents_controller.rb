class DocumentsController < ApplicationController
  # permit "registered"
  
  # POST /documents
  def create
     @document = Document.create(params[:document])
     @document.add_default_page
     
     # document.accepts_role 'owner', current_user
     data_hash = {}
     data_hash['css'] = {:width => "1280px", :height => "720px", :backgroundColor => "black"}
     default_page = document.pages.build(:uuid => UUID.generate(), :data => data_hash.to_json, :position => 1)
     
     render :json => @document
  end

  def update
    @document = find_by_id_or_uuid!(params[:id])
    logger.debug "update document with new title #{params[:title]}"
    @document.update_attributes( :title =>params[:title]);
    render :json => @document.to_json
  end

  def index
    @synchronised_at = Time.now.utc
    @documents = []
    #TODO how to get server url without request object?
    # @domain = "#{request.protocol}#{request.host_with_port}"
    respond_to do |format|
      format.html do
        @is_document_page = true
        if (!current_user)
          @documents = Document.find_all_by_is_public(true)
          render :action => 'index_public'
        else
          @documents = current_user.documents(:with_deleted => false)
          @public_documents = Document.find_all_by_is_public(true).select do |an_object|
            !(@documents.include? an_object)
          end
          render :action => 'index'
        end
      end
      format.xml do
        permit 'registered'
          if (current_user)
            @documents = current_user.documents(:with_deleted => true)
          end
      end
      format.json do
        @documents = current_user.documents(:with_deleted => false)
        render :json => @documents.to_json
      end
    end
  end

  def show
    @document = find_by_id_or_uuid!(params[:id])
    @page = @document.pages[0]
    #TODO how to get server url without request object?
    if (@page)
      @page_url =  @page.url("application/xhtml+xml")
    end
    @domain = request.protocol + request.host_with_port
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.html {
          render :action => "showproto", :layout => false, :content_type => "application/xhtml+xml"
          #redirect_to @page_url
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
#
#    @document = find_by_id_or_uuid!(params[:id])
#
#respond_to do |format|
#      if @document
#        if @document.is_public || permit?('owner of document')
#          format.html
#          format.xml { render :xml => @document.to_xml }
#        else
#          format.html { render_optional_error_file(:forbidden) }
#          format.xml { head :forbidden }
#        end
#      else
#          format.html { render_optional_error_file(:not_found) }
#          format.xml { head :not_found }
#      end
#    end
  end

  def destroy
    @document = find_by_id_or_uuid!(params[:id])

    respond_to do |format|
      if @document && permit?('owner of document')
        if @document.destroy
          format.html { redirect_back_or_default documents_url }
          format.xml { head :ok }
          format.json { render :json => {} }
        else
          format.html {render_optional_error_file(:not_found)}
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      else
        format.html { render_optional_error_file(:forbidden)}
        format.xml { head :forbidden }
      end
    end
  end

end