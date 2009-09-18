class ItemsController < ApplicationController
  before_filter :login_required
  before_filter :instantiate_document_and_page
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    render :json => @page.items.create(params[:item])
  end

  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @pages.items.find(params[:id])
    @item.update_attributes(params[:item])
    render :json => @item
  end

  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @pages.items.find(params[:id])
    @item.destroy
    # render :json => {}
  end
  
private
  
  def instantiate_document_and_page
    @document = Document.find(params[:document_id])
    @page = @document.pages.find(params[:page_id])
  end
  
end