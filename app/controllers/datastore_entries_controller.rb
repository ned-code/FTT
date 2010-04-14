class DatastoreEntriesController < ApplicationController
  before_filter :instantiate_document_and_item
  
  access_control do
    allow :admin
    allow :editor, :of => :document
    actions :index, :create, :destroy do
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # GET /items/:item_id/datastore_entries
  # GET /items/:item_id/datastore_entries/:key  (with only_current_user = true)
  def index
    @datastore_entries = @item.datastore_entries.filter_with(current_user, params)
    
    respond_to do |format|
      format.json { render :json => @datastore_entries.map{ |de| de.filtered_json(current_user) } }
    end
  end
  
  # POST /items/:item_id/datastore_entries
  def create
    @datastore_entry = DatastoreEntry.create_or_update(current_user, @item, params[:datastore_entries])
    
    respond_to do |format|
      format.json { render :json => @datastore_entry.filtered_json(current_user), :status => :ok }
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
    DatastoreEntry.destroy_all(:item_id => @item.id)
    
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