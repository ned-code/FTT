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
    if user_signed_in?
      @datastore_entry = current_user.datastore_entries.find_by_ds_key!(params[:id])
    else
      # need to manage anonymous user
    end
    
    respond_to do |format|
      format.json { render @datastore_entry }
    end
  end
  
  # POST /items/:item_id/datastore_entries
  def create
    DatastoreEntry.create_or_update(@item, params[:datastore_entries])
    
    respond_to do |format|
      format.json { render :json => {}, :status => :ok }
    end
  end
  
  # DELETE /items/:item_id/datastore_entries/:id
  def destroy
    if user_signed_in?
      @datastore_entry = current_user.datastore_entries.find_by_ds_key!(params[:id])
    else
      # need to manage anonymous user
    end
    @datastore_entry.destroy
    
    respond_to do |format|
      format.json { render :json => {}, :status => :ok }
    end
  end
  
  # DELETE /items/:item_id/datastore_entries
  def destroy_all
    DatastoreEntry.destroy_all(:widget_uuid => @item.uuid)
    
    respond_to do |format|
      format.json { render :json => {}, :status => :ok }
    end
  end
  
private
  
  def instantiate_document_and_item
    @item = Item.find_by_uuid!(params[:item_id])
    @document = @item.page.document
  end
  
end