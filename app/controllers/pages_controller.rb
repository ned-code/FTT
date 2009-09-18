class PagesController < ApplicationController
  before_filter :login_required
  before_filter :instantiate_document
  
  # GET /documents/:document_id/pages
  def index
    render :json => @document.pages
  end
  
  # GET /documents/:document_id/pages/:id
  def show
    @page = @document.pages.find_by_id_or_position(params[:id])
    render :json => @page.to_json(:include => :items)
  end
    
  # POST /documents/:document_id/pages
  def create
    render :json => @document.pages.create(params[:page])
  end

  # PUT /documents/:document_id/pages/:id
  def update
    @page = @document.pages.find(params[:id])
    @page.update_attributes(params[:page])
    render :json => @page
  end

  # DELETE /documents/:document_id/pages/:id
  def destroy
    @page = @document.pages.find(params[:id])
    @page.destroy
    render :json => {}
  end
  
private
  
  def instantiate_document
    @document = Document.find(params[:document_id])
  end
  

end