class PagesController < ApplicationController
  before_filter :login_required
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
    @page = @document.pages.find_by_id_or_position(params[:id])
    render :json => @page.to_json(:include => :items)
  end
  
  # POST /documents/:document_id/pages
  def create
    #TODO how to manage hash in hash (page.data.css.height = 12)
    # if (params[:page][:data])
    #   params[:page][:data] = JSON.parse(params[:page][:data])  
    # end
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
    render :json => @page.to_json(:include => :items)
  end
  
  # PUT /documents/:document_id/pages/:id
  def update
    @page = @document.pages.find(params[:id])
    #TODO how to manage hash in hash (page.data.css.height = 12)
    # if (params[:page][:data])
    #   params[:page][:data] = JSON.parse(params[:page][:data])  
    # end
    
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