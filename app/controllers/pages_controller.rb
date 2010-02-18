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
    render :json => @page.to_json(:include => :items)
  end
  
  # POST /documents/:document_id/pages
  def create
    if (params[:page][:items])
      new_items = JSON.parse params[:page][:items]
      params[:page].delete(:items)  
    end    
    @page = @document.pages.new(params[:page])
    @page.uuid = params[:page][:uuid]
    @page.save
    if new_items
      new_items.each do |an_item|
        new_item = @page.items.new(an_item)
        new_item.uuid = an_item['uuid']
        new_item.save        
      end  
    end    
    message = { :source => params[:source], :page =>  @page.attributes() }
    message[:page][:items] = new_items
    
    xmpp_notify message.to_json
    render :json => @page.to_json(:include => :items)
  end
  
  # PUT /documents/:document_id/pages/:id
  def update
    @page = @document.pages.find_by_uuid(params[:id])
    
    @page.update_attributes(params[:page])
    message = { :source => params[:source], :page =>  @page.attributes() }
    
    xmpp_notify message.to_json
    render :json => @page
  end
  
  # DELETE /documents/:document_id/pages/:id
  def destroy
    @page = @document.pages.find_by_uuid(params[:id])
    @page.destroy
    message = { :source => params[:source], :page =>  { :uuid => params[:id] }, :action => "delete" }
    
    xmpp_notify message.to_json
    render :json => {}
  end
  
  private
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:document_id])
  end
  
end