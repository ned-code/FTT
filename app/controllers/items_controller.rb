class ItemsController < ApplicationController
  before_filter :login_required
  before_filter :instantiate_document_and_page
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    if (params[:item][:data])
      params[:item][:data] = JSON.parse(params[:item][:data])  
    end    
    @item = @page.items.new(params[:item])
    @item.uuid = params[:item][:uuid]
    @item.save
    render :json => @item
  end

  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @page.items.find(params[:id])
    if (params[:item][:data])
      params[:item][:data] = JSON.parse(params[:item][:data])  
    end   
    @item.update_attributes(params[:item])
    render :json => @item
  end

  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @page.items.find(params[:id])
    @item.destroy
    render :json => {}
  end
  
private
  
  def instantiate_document_and_page
    @document = Document.find(params[:document_id])
    @page = @document.pages.find(params[:page_id])
  end
  
end