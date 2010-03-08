class ItemsController < PageController
  access_control do
    allow :admin
    allow :editor, :of => :document
    action :show do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # POST /documents/:document_id/pages/:page_id/items/:id
  def show
    @item = @page.items.find_by_uuid(params[:id])
    
    render :layout => false
  end
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    @item = @page.items.new(params[:item])
    @item.must_notify = true
    @item.save
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