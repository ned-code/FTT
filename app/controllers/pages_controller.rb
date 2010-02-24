class PagesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :instantiate_document
  access_control do
    allow :admin
    allow logged_in, :to => [:index]
    allow :owner, :of => :document 
    allow :editor, :of => :document
    allow :reader, :of => :document, :to => [:show]
    allow logged_in, :to => [:show], :if => :public_document?
    allow logged_in, :if => :public_edit_document?
  end
  
  # GET /documents/:document_id/pages
  def index
    render :json => @document.pages
  end
  
  # GET /documents/:document_id/pages/:id
  def show
    @page = @document.pages.find_by_uuid_or_position(params[:id])
    respond_to do |format|
      format.html do
        logger.debug "user agent #{request.user_agent}"
        if (!/(.*)Google.*/.match(request.user_agent))
          redirect_to "/documents/#{@document.uuid}##{@page.uuid}"
        else
          render :layout => "layouts/static_page"
        end
      end
      format.json { render :json => @page.to_json(:include => :items) }      
    end        
  end
  
  # POST /documents/:document_id/pages
  def create
    @page = @document.pages.new(params[:page])
    @page.uuid = params[:page][:uuid]
    @page.save    
    
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