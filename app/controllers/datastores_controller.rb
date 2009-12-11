class DatastoresController < ApplicationController

  # GET /datastore/set?key&value&widget_uuid&isunique
  def set
    key = params[:key]
    value = params[:value]
    widget_uuid = params[:widget_uuid]
    is_unique = params[:isunique]
    user_id = getCurrentUserId

    #check parameters
    if(key == nil || key == '')
      render :text => 'Key is nil.' #print error
      return
    end
    if(value == nil || value == '')
      render :text => 'Value is nil.' #print error
      return
    end
    if(is_unique == nil || is_unique == '')
      is_unique = false
    end
    
    #check if widget exists
    if(widget_uuid != nil)
      if(!Item.find(:first, :conditions => {:uuid => widget_uuid}))
        render :text => 'Widget doesn\'t exist.' #print error
        return
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
      if(ds = Datastore.find(:first,:conditions => {:ds_key => key, :widget_uuid => widget_uuid})) 
        #unique record exist
        #can the user update the existing key?
        if(isEditorOfDocument || ds.user_id == nil || ds.user_id == user_id)
          #update the record
          ds.ds_value = value
          ds.save
        else
          render :text => 'Cannot update record' #print error
          return
        end
      else #unique record, doesn't exist
        #create the new key
        needToCreate = true
      end
    else #record is not unique
      #is user connected
      if(user_id != nil)
        #has already a record for itself
        if(ds = Datastore.find(:first,:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id})) 
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
      ds = Datastore.new()
      ds.ds_key = key
      ds.ds_value = value
      ds.widget_uuid = widget_uuid
      ds.user_id = user_id
      ds.save
    end
  
    render :text => '' #ok, no error
  end
  
  # GET /datastore/remove?key&widget_uuid
  def remove    
     key = params[:key]
     widget_uuid = params[:widget_uuid]
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

    Datastore.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid}).each do |record|
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
  
  # GET /datastore/get?key&widget_uuid
  def get
    key = params[:key]
    widget_uuid = params[:widget_uuid]
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
   #Datastore.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id}).each do |record|
   #  output += record.ds_value
   #end
   #render :text => output
   
   ActiveRecord::Base.include_root_in_json = true
   render :json => Datastore.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid}).to_json(:only => [:ds_key, :ds_value])
  end
  
  # GET /datastore/getForCurrentUser?key&widget_uuid
  def getForCurrentUser
    key = params[:key]
    widget_uuid = params[:widget_uuid]
    user_id = getCurrentUserId

     #check parameters
     if(key == nil || key == '')
       render :text => 'Key is nil' #print error
       return
     end

    ActiveRecord::Base.include_root_in_json = true
    render :json => Datastore.find(:all,:conditions => {:ds_key => key, :widget_uuid => widget_uuid, :user_id => user_id}).to_json(:only => [:ds_key, :ds_value])    
  end
  
  # GET /datastore/getAllKeys?widget_uuid
  def getAllKeys
    widget_uuid = params[:widget_uuid]

    #can current user read document containing the widget
    if(widget_uuid != nil)
      if(!canCurrentUserReadDocument(getDocumentOfWidget(widget_uuid)))
          render :text => 'User has no right on the document' #print error
          return
      end
    end
    
   ActiveRecord::Base.include_root_in_json = true
   render :json => Datastore.find(:all,:select => 'DISTINCT ds_key',:conditions => {:widget_uuid => widget_uuid}).to_json(:only => [:ds_key])    
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
    if(w = Item.find(:first,:conditions => {:uuid => widget_uuid}))
      #get page
      if(p = Page.find(:first, :conditions => {:uuid => w.page_id}))
        return p.document_id
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
    #  if(w = Item.find(:first,:conditions => {:uuid => widget_uuid}))
    #    #get page
    #    if(p = Page.find(:first, :conditions => {:uuid => w.page_id}))
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
