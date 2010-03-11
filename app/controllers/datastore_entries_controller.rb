class DatastoreEntriesController < ApplicationController
  
  before_filter :instantiate_document_and_item
  
  access_control do
    allow :admin    
    allow :reader, :of => :document
    allow :editor, :of => :document
    allow all, :if => :document_is_public?, :except => [:index]
  end
  
  #GET /datastores/:widget_item_id/datastoreEntries?only_current_user=bool
  def index
    only_current_user = params[:only_current_user] == 'true'
    
    if(only_current_user)
      render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => @widget_item.uuid, :user_id => current_user.id}).to_json(:only => [:ds_key, :ds_value])    
    else
      render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => @widget_item.uuid}).to_json(:only => [:ds_key, :ds_value])    
    end
  end
  
  #POST /datastores/:widget_item_id/datastoreEntries
  def create
    key = params[:key]
    value = params[:value]
    datastore_id = params[:datastore_id]
    is_unique = params[:unique_key]
    
    #check parameters
    if(key == nil || key == '')
      render :text => 'Key is nil.' #print error
      return
    end
    if(value == nil || value == '')
      render :text => 'Value is nil.' #print error
      return
    end
    if(is_unique == 'true' || is_unique == true)
      is_unique = true
    else
      is_unique = false
    end
    
    #check if widget exists
    if(!@widget_item)
        render :text => 'Widget doesn\'t exist.' #print error
        return
    end
    DatastoreEntry.createOrUpdate(datastore_id, key, value, is_unique)
    
    render :text => '' #ok, no error
  end
  
  #GET /datastores/:widget_item_id/datastoreEntries/:id
  def show
    key = params[:id]
    datastore_id = params[:datastore_id]
    only_current_user = params[:only_current_user] == 'true'
    
    #check parameters
    if(key == nil || key == '')
      render :text => 'Key is nil' #print error
      return
    end    
    
    json_filter = [:ds_key, :ds_value]
    methods = []
    if (current_user && current_user.has_role?("editor", @document))
      json_filter = [:ds_key, :ds_value, :updated_at]
      methods = [:email]
    end
    
    all_entries = DatastoreEntry.getAllDatastoreEntries(datastore_id, key, only_current_user)
    render :json => all_entries.to_json(:only => json_filter, :methods => methods)
  end
  
  #DELETE /datastores/:widget_item_id/datastoreEntries/:id
  #DELETE /datastores/:widget_item_id/datastoreEntries/ALL?ALL=true => remove all keys
  def destroy
    key = params[:id]
    delete_all = params[:ALL] == 'true'
    datastore_id = params[:datastore_id]
    
    
    if(delete_all && current_user && current_user.has_role?("editor", @document)) #delete all keys
      DatastoreEntry.destroy_all(:widget_uuid => datastore_id)
    else #delete 1 key
      #check parameters
      if(key == nil || key == '')
        render :text => 'Key is nil' #print error
        return
      end     
      if (current_user)
        DatastoreEntry.destroy_all(:ds_key => key, :widget_uuid => datastore_id, :user_id => current_user.id)
      else
        # need to manage anonymous user
      end    
    end
    
    render :text => '' #ok, no error
  end
  
  #####################################################################################################################
  ####################################### private internal method #####################################################
  #####################################################################################################################
  private
  
  def instantiate_document_and_item
    @widget_item = Item.find_by_uuid(params[:datastore_id])
    @document = @widget_item.page.document if @widget_item
  end
  
  def document_is_public?
    @document && @document.is_public?
  end  
  
end