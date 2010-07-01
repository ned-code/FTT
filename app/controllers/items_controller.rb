
require Rails.root + 'lib/shindig'

class ItemsController < PageController
  before_filter :authenticate_user!
  access_control do
    allow :admin
    allow :editor, :of => :document
    action :show do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # GET /documents/:document_id/pages/:page_id/items/:id
  def show
    @item = @page.items.find_by_uuid(params[:id])
    if @item
      render :layout => false
    else
      forbidden_access
    end  
  end
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    @item = @page.items.new_with_uuid(params[:item])
    @item.save!
    message = { :source => params[:xmpp_client_id], :item =>  @item.attributes }      
    @@xmpp_notifier.xmpp_notify(message.to_json, @item.page.document.uuid)
    render :json => @item
  end
  
  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = @page.items.find_by_uuid(params[:id])
    @item.update_attributes!(params[:item])    
    message = { :source => params[:xmpp_client_id], :item =>  @item.attributes }
    @@xmpp_notifier.xmpp_notify(message.to_json, @item.page.document.uuid)
    render :json => @item
  end
  
  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = @page.items.find_by_uuid(params[:id])
    @item.destroy
    message = { :source => params[:xmpp_client_id], :item =>  { :page_id => @item.page.id, :uuid => @item.uuid }, :action => "delete" }
    @@xmpp_notifier.xmpp_notify(message.to_json, @item.page.document.uuid)   
    render :json => {}
  end
  
  # GET /documents/:document_id/pages/:page_id/items/:id/secure_token
  def secure_token
    response = Hash.new
    if current_user
      @item = @page.items.find_by_uuid(params[:id])
      
      token = Shindig.generate_secure_token(@item.page.document.creator.uuid, current_user.uuid, @item.uuid, 0, '')
      response['security_token'] = token;
    else
      response['security_token'] = "";
    end
     render :json => response
  end
  
end