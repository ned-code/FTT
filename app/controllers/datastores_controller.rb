class DatastoresController < ApplicationController
  def index
    #@documents = Document.all_with_filter(current_user, params[:document_filter], params[:page], per_page)
    #@documents = DatastoreEntry.find(:all)
    #@join = "INNER JOIN pages ON documents.id=pages.document_id"
    #@join += " INNER JOIN items ON pages.id=items.page_id"
    #@join += " INNER JOIN medias ON items.media_id=medias.id"
    #@join += " INNER JOIN datastore_entries ON items.uuid=datastore_entries.widget_uuid"
    #@select = "documents.title,documents.uuid"
    #@select += ",items.id as i_id, medias.title as m_title, pages.position as p_position, pages.uuid as p_uuid"
    #@select += ",datastore_entries.ds_key as de_key,datastore_entries.ds_value as de_value,datastore_entries.updated_at as de_updated_at"
    #@order = "documents.title, documents.id,medias.title,datastore_entries.updated_at"
    #@records = Document.find(:all,:select => @select, :joins=>@join, :order=>@order)
    
    #@join = "INNER JOIN pages ON documents.id=pages.document_id"
    #@join += " INNER JOIN items ON pages.id=items.page_id"
    #@join += " INNER JOIN medias ON items.media_id=medias.id"
    #@join += " INNER JOIN datastore_entries ON items.uuid=datastore_entries.widget_uuid"
    
    @join = "INNER JOIN items ON datastore_entries.widget_uuid=items.uuid"
    @join += " INNER JOIN medias ON items.media_id=medias.id"
    @join += " INNER JOIN pages ON items.page_id=pages.id"
    @join += " INNER JOIN documents ON pages.document_id=documents.id "
    @select = "documents.title,documents.uuid"
    @select += ",items.id as i_id, medias.title as m_title, pages.position as p_position, pages.uuid as p_uuid"
    @select += ",datastore_entries.ds_key as de_key,datastore_entries.ds_value as de_value,datastore_entries.updated_at as de_updated_at"
    @order = "documents.title, documents.id,medias.title,datastore_entries.updated_at"

    
    @records = DatastoreEntry.find(:all,:select => @select, :joins=>@join, :order=>@order, :conditions => {:user_id => current_user.id})
    
    #render :text => user_id
  end
  
    #GET /datastores/:id
   def show
    render :text => 'to do'
   end
end
