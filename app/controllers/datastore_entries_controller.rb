class DatastoreEntriesController < ApplicationController
  before_filter :instantiate_document_and_item
  
  access_control do
    allow :admin
    allow :editor, :of => :document
    actions :show, :create, :destroy do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # GET /items/:item_id/datastore_entries?only_current_user=bool
  def index
    only_current_user = params[:only_current_user] == 'true'
    
    if(only_current_user)
      render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => @item.uuid, :user_id => current_user.id}).to_json(:only => [:ds_key, :ds_value])    
    else
      render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => @item.uuid}).to_json(:only => [:ds_key, :ds_value])    
    end
  end
  
  # GET /items/:item_id/datastore_entries/:id
  def show
    only_current_user = params[:only_current_user] == 'true'
    
    json_filter = [:ds_key, :ds_value]
    methods = []
    if (current_user && current_user.has_role?("editor", @document))
      json_filter = [:ds_key, :ds_value, :updated_at]
      methods = [:email]
    end
    
    all_entries = DatastoreEntry.get_all_datastore_entries(@item, params[:id], only_current_user)
    render :json => all_entries.to_json(:only => json_filter, :methods => methods)
  end
  
  # POST /items/:item_id/datastore_entries
  def create
    DatastoreEntry.create_or_update(@item, params[:datastore_entries])
    
    respond_to do |format|
      format.json { render :json => '', :status => :ok }
    end
  end
  
  # DELETE /items/:item_id/datastore_entries/:id
  def destroy
    if user_signed_in?
      @item = current_user.datastore_entries.find_by_ds_key!(params[:id])
    else
      # need to manage anonymous user
    end
    @item.destroy
    
    respond_to do |format|
      format.json { render :json => '', :status => :ok }
    end
  end
  
  # DELETE /items/:item_id/datastore_entries
  def destroy_all
    DatastoreEntry.destroy_all(:widget_uuid => @item.uuid)
    
    respond_to do |format|
      format.json { render :json => '', :status => :ok }
    end
  end
  
private
  
  def instantiate_document_and_item
    @item = Item.find_by_uuid!(params[:item_id])
    @document = @item.page.document
  end
  
end