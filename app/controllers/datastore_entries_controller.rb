class DatastoreEntriesController < ApplicationController
  #GET /datastores/:widget_item_id/datastoreEntries?only_current_user=bool
  def index
    widget_uuid = params[:datastore_id]
    only_current_user = params[:only_current_user] == 'true' ? true : false

    #can current user read document containing the widget
    if(widget_uuid != nil)
      if(!canCurrentUserReadDocument(getDocumentOfWidget(widget_uuid)))
          render :text => 'User has no right on the document' #print error
          return
      end
    end
    
   #if(only_current_user == true)
   #   render :json => DatastoreEntry.find(:all,:select => 'DISTINCT ds_key',:conditions => {:widget_uuid => widget_uuid, :user_id => user_id}).to_json(:only => [:ds_key, :ds_value])    
   #else
   #   render :json => DatastoreEntry.find(:all,:select => 'DISTINCT ds_key',:conditions => {:widget_uuid => widget_uuid}).to_json(:only => [:ds_key, :ds_value])    
   #end
   if(only_current_user == true)
       render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => widget_uuid, :user_id => user_id}).to_json(:only => [:ds_key, :ds_value])    
    else
       render :json => DatastoreEntry.find(:all,:conditions => {:widget_uuid => widget_uuid}).to_json(:only => [:ds_key, :ds_value])    
    end
  end
  
  #POST /datastores/:widget_item_id/datastoreEntries
  def create
    key = params[:key]
    value = params[:value]
    widget_uuid = params[:datastore_id]
    is_unique = params[:unique_key]
    user_id = getCurrentUserId

    #check parameters
    if(key == nil || key == '')
      render :text => 'Key is nil.' #print error
    end
    if(value == nil || value == '')
      render :text => 'Value is nil.' #print error
    end
    if(is_unique == 'true' || is_unique == true)
      is_unique = true
    else
      is_unique = false
    end
    
    #check if widget exists
    if(widget_uuid != nil)
      unless Item.find_by_uuid(widget_uuid)
        render :text => 'Widget doesn\'t exist.' #print error
      end
    end
    
    #can current user read document containing the widget
    isEditorOfDocument = false
    if(widget_uuid != nil)
      isEditorOfDocument = canCurrentUserReadDocument(getDocumentOfWidget(widget_uuid))
    end
    
    needToCreate = false
                
    #check if the key already exists
    if(is_unique)
      if(ds = DatastoreEntry.find(:first,:conditions => {:ds_key => key, :widget_uuid => widget_uuid})) 
        #unique record exist
        #can the user update the existing key?
        if(isEditorOfDocument || ds.user_id == nil || ds.user_id == user_id)
          #update the record
          ds.ds_value = value
          ds.save
        else
          render :text => 'Cannot update record' #print error
        end
      else #unique record, doesn't exist
        #create the new key
        needToCreate = true
      end
    else #record is not unique
      #is user connected
      if(user_id != nil)
        #has already a record for itself
        if(ds = DatastoreEntry.find(:first,:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id})) 
          #update the record
          ds.ds_value = value
          ds.save
        else
          #create a new key
          needToCreate = true
        end
      else
        #anonymous - cannot modified previous record
        #create a new key
        needToCreate = true
      end
    end
     
    if(needToCreate)
      #create the new key
      ds = DatastoreEntry.new()
      ds.ds_key = key
      ds.ds_value = value
      ds.widget_uuid = widget_uuid
      ds.user_id = user_id
      ds.save
    end
  
    render :text => '' #ok, no error
  end
  
  #GET /datastores/:widget_item_id/datastoreEntries/:id
  def show
    #render :text => "#{params.inspect}"
     key = params[:id]
     widget_uuid = params[:datastore_id]
     only_current_user = params[:only_current_user] == 'true' ? true : false
     user_id = getCurrentUserId

     #check parameters
     if(key == nil || key == '')
       render :text => 'Key is nil' #print error
       return
     end

     #can current user read document containing the widget
     if(widget_uuid != nil)
       if(!canCurrentUserReadDocument(getDocumentOfWidget(widget_uuid)))
           render :text => 'User has no right on the document' #print error
           return
       end
     end

    #output = ''
    #DatastoreEntry.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id}).each do |record|
    #  output += record.ds_value
    #end
    #render :text => output

    json_filter = [:ds_key, :ds_value]
    #if editor of document, add more information to record
    if(canCurrentUserEditDocument(getDocumentOfWidget(widget_uuid)))
      json_filter = [:ds_key, :ds_value, :updated_at, :email]
    end
    
    if(only_current_user == true)
      render :json => DatastoreEntry.find(:all,:joins=>"JOIN users ON datastore_entries.user_id=users.id",:select=>"datastore_entries.*,users.email",:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id}).to_json(:only => json_filter)
    else
      render :json => DatastoreEntry.find(:all,:joins=>"JOIN users ON datastore_entries.user_id=users.id",:select=>"datastore_entries.*,users.email",:conditions => {:ds_key => key, :widget_uuid => widget_uuid}).to_json(:only => json_filter)
    end
  end
  
  #DELETE /datastores/:widget_item_id/datastoreEntries/:id
  def destroy
     key = params[:id]
     widget_uuid = params[:datastore_id]
     user_id = getCurrentUserId

     #check parameters
     if(key == nil || key == '')
       render :text => 'Key is nil' #print error
       return
     end

     #can current user edit document containing the widget
     isDocumentEditor = false
     if(widget_uuid != nil)
       isDocumentEditor = canCurrentUserEditDocument(getDocumentOfWidget(widget_uuid))
     end

    DatastoreEntry.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid}).each do |record|
      #is editor of document, or owner of record = can delete key
      if(isDocumentEditor || record.user_id == user_id)
        record.delete
      else
        render :text => 'Cannot remove key.' #print error
        return
      end
    end
    
    render :text => '' #ok, no error
  end
  
  #####################################################################################################################
  ####################################### private internal method #####################################################
  #####################################################################################################################
  private
  
  def getCurrentUserId
    if(current_user == nil)
      return nil;
    end
    
    return current_user.id
  end
  
  def getDocumentOfWidget(widget_uuid)
    #get widget
    if w = Item.find_by_uuid(widget_uuid)
      #get page
      if p = w.page
        return p.document.uuid
      end
    end
 
    return nil
  end
  
  def canCurrentUserEditDocument(document_uuid)
    #todo
    user_id = getCurrentUserId
    if(user_id == nil)
      return false
    end

    return true
  end
  
  def canCurrentUserReadDocument(document_uuid)
    #todo
    user_id = getCurrentUserId
    if(user_id == nil)
      return false
    end
    
    return true
    
    #if(widget_uuid != nil) #has user read right on document containing widget
    #  hasRight = true
    #  #get widget
    #  if(w = Item.find_by_uuid(widget_uuid))
    #    #get page
    #    if(p = w.page)
    #      #check if has right
    #      if(r = Role.find(:all, :conditions => {}))
    #      else
    #        hasRight = false
    #      end
    #    else
    #      hasRight = false
    #    end
    #  else
    #    hasRight = false
    #  end
  end
end
