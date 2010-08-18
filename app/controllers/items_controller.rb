require Rails.root + 'lib/shindig'

class ItemsController < ApplicationController
  
  # access_control do
  #   action :show do
  #     allow all, :if => :document_is_public?
  #   end
  #   allow :editor, :of => :pseudo_document
  #   allow :admin
  # end

  before_filter :find_document, :only => [:show, :create]
  
  # GET /documents/:document_id/pages/:page_id/items/:id
  def show
    authorize! :read, @document
    find_document
    find_page
    @item = @page.items.not_deleted.find_by_uuid(params[:id])
    if @item
      render :layout => false
    else
      render :file => "#{Rails.public_path}/403.html", :status => 403
    end  
  end
  
  # POST /documents/:document_id/pages/:page_id/items
  def create
    authorize! :update, @document
    @item = Item.find_deleted_and_restore(params[:item][:uuid])
    if @item.nil?
      @item = Item.new_with_uuid(params[:item])
      @item[:page_id] = params[:page_id]
      @item[:creator_id] = current_user.uuid
    end
    @item.document_uuid = params[:document_id]
    @item.save!
    message = @item.as_json({})
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, params[:document_id])
    render :json => @item
  end
  
  # PUT /documents/:document_id/pages/:page_id/items/:id
  def update
    @item = Item.not_deleted.find_by_uuid(params[:id])
    authorize! :update, @item
    @item.document_uuid = params[:document_id]
    @item.update_attributes!(params[:item])    
    message = @item.as_json({})
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, params[:document_id])
    render :json => @item
  end
  
  # DELETE /documents/:document_id/pages/:page_id/items/:id
  def destroy
    @item = Item.not_deleted.find_by_uuid(params[:id])
    authorize! :destroy, @item
    @item.document_uuid = params[:document_id]
    @item.safe_delete!
    message = { :source => params[:xmpp_client_id], :item =>  { :page_id => @item[:page_id], :uuid => @item.uuid }, :action => "delete" }
    @@xmpp_notifier.xmpp_notify(message.to_json, params[:document_id])   
    render :json => {}
  end
  
  # GET /documents/:document_id/pages/:page_id/items/:id/secure_token
  def secure_token    
    response = Hash.new
    if current_user
      find_page
      @item = @page.items.not_deleted.find_by_uuid(params[:id])
      
      token = Shindig.generate_secure_token(@item.page.document.creator.uuid, current_user.uuid, @item.uuid, 0, '')
      response['security_token'] = token;
    else
      response['security_token'] = "";
    end
     render :json => response
  end

private

  def find_item
    @item = @page.items.find_by_uuid(params[:page_id])
  end

  def find_page
    @page = @document.pages.find_by_uuid(params[:page_id])
  end

  def find_document
    @document = Document.find_by_uuid(params[:document_id])
  end

  def find_pseudo_document
    @pseudo_document = Document.find(params[:document_id], :select => 'documents.uuid')
  end
  
end