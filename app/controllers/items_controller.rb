class ItemsController < PageController
  before_filter :authenticate_user!
  
  access_control do
    allow :admin
    allow :editor, :of => :document
    actions [:index, :show] do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # POST /documents/:document_id/pages/:page_id/items/:id
  def show
    @item = @page.items.find_by_uuid(params[:id])
    if params[:fullHTML] && @item.data[:innerHTML] !=~ /<html>(.|\n)*<\/html>/mi
      render :text => "<html><head></head><body>#{@item.data[:innerHTML]}</body>"
    else
      render :text => @item.data[:innerHTML]
    end
  end
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    @item = @page.items.create(params[:item].merge(:must_notify => true))
    
    render :json => @item
  end
  
  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @page.items.find_by_uuid(params[:id])
    @item.update_attributes(params[:item].merge(:must_notify => true))
    
    render :json => @item
  end
  
  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @page.items.find_by_uuid(params[:id])
    @item.destroy
    
    render :json => {}
  end
  
end