class PagesController < DocumentController
  access_control do
    allow :admin
    allow :editor, :of => :document
    actions :index, :show do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # GET /documents/:document_id/pages
  def index
    render :json => @document.pages
  end
  
  # GET /documents/:document_id/pages/:id
  def show
    @page = @document.pages.find_by_uuid_or_position!(params[:id])
    respond_to do |format|
      # JBA TEMP
      # format.html do
      #   logger.debug "user agent #{request.user_agent}"
      #   if (!/(.*)Google.*/.match(request.user_agent))
      #     redirect_to "/documents/#{@document.uuid}##{@page.uuid}"
      #   else
      #     render :layout => "layouts/static_page"
      #   end
      # end
      format.html { render :layout => "layouts/static_page" }
      format.json { render :json => @page.to_json(:include => :items) }
    end
  end
  
  # POST /documents/:document_id/pages
  def create
    @page = @document.pages.create(params[:page])
    
    render :json => @page.to_json(:include => :items)
  end
  
  # PUT /documents/:document_id/pages/:id
  def update
    @page = @document.pages.find_by_uuid(params[:id])
    @page.update_attributes(params[:page])
    
    render :json => @page
  end
  
  # DELETE /documents/:document_id/pages/:id
  def destroy
    @page = @document.pages.find_by_uuid(params[:id])
    @page.destroy
    
    render :json => {}
  end
  
end