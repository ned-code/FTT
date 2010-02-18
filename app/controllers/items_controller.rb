class ItemsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :instantiate_document_and_page
  access_control do
    allow :admin
    allow logged_in, :to => [:index]
    allow :owner, :of => :document
    allow :editor, :of => :document
    allow :reader, :of => :document, :to => [:show]   
    allow logged_in, :to => [:show], :if => :public_document?
    allow logged_in, :if => :public_edit_document?     
  end
  
  # POST /documents/:document_id/pages/:page_id/items/:id
  def show
    @item = @page.items.find_by_uuid(params[:id])
    if params[:fullHTML]
      if (@item[:data][:innerHTML] =~  /<html>(.|\n)*<\/html>/mi) == 0
        render :text => @item[:data][:innerHTML]
      else
        render :text => "<html><head></head><body>#{@item[:data][:innerHTML]}</body>"
      end
    else
      render :text => @item[:data][:innerHTML]
    end
  end
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    @item = @page.items.build(params[:item])
    @item.must_notify = true
    @item.save
    render :json => @item
  end

  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @page.items.find_by_uuid(params[:id])
    @item.must_notify = true
    @item.update_attributes(params[:item])
    render :json => @item
  end

  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @page.items.find_by_uuid(params[:id])
    @item.destroy
    render :json => {}
  end
  
private
  
  def instantiate_document_and_page
    @document = Document.find_by_uuid(params[:document_id])
    @page = @document.pages.find_by_uuid(params[:page_id])
  end
  
end