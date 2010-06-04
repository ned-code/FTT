class PagesController < DocumentController
  before_filter :authenticate_user!
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
    @page = @document.pages.new_with_uuid(params[:page])
    @page.must_notify = true
    @page.save!
    if (params[:page][:items_attributes].present?)
      render :json => @page.to_json(:include => :items)
    else
      render :json => @page
    end
  end
  
  # PUT /documents/:document_id/pages/:id
  def update
    deep_notify = params[:page][:items_attributes].present?
    @page = @document.pages.find_by_uuid(params[:id])
    @page.must_notify = true
    @page.deep_notify = deep_notify
    @page.update_attributes!(params[:page])
    # TODO JBA seems that update atribute does not refresh nested attributes so we need to refresh
    @page.reload
    if (deep_notify)
      render :json => @page.to_json(:include => :items)
    else
      render :json => @page
    end
  end
  
  # DELETE /documents/:document_id/pages/:id
  def destroy
    @page = @document.pages.find_by_uuid(params[:id])
    @page.must_notify = true
    @page.destroy
    
    render :json => {}
  end
  
end