class ItemsController < ApplicationController
  before_filter :login_required
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
  def show
    @item = @page.items.find(params[:id])
    if (params[:fullHTML])
      if ((@item[:data][:innerHTML] =~  /<html>(.|\n)*<\/html>/mi) == 0)
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
    @item = @page.items.new(params[:item])
    @item.uuid = params[:item][:uuid]
    @item.save
    message = { :source => params[:source], :item =>  params[:item] }
    xmpp_notify message.to_json    
    render :json => @item
  end

  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @page.items.find(params[:id])
    @item.update_attributes(params[:item])
    message = { :source => params[:source], :item =>  params[:item] }
    xmpp_notify message.to_json    
    render :json => @item
  end

  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @page.items.find(params[:id])
    @item.destroy
    message = { :source => params[:source], :item =>  { :page_id => @page.uuid, :uuid => params[:id]  }, :action => "delete" }

    xmpp_notify message.to_json    
    render :json => {}
  end
  
private
  
  def instantiate_document_and_page
    @document = Document.find(params[:document_id])
    @page = @document.pages.find(params[:page_id])
  end
  
end