class DatastoreEntry < ActiveRecord::Base    
  # ================
  # = Associations =
  # ================
  belongs_to :widget, :class_name => "Medias::Widget"
  belongs_to :user
    
  # ===============
  # = Validations =
  # ===============
  
  # =================
  # = Class Methods =
  # =================
  def self.get_document_of_widget(widget_uuid)
    #get widget
    if w = Item.find_by_uuid(widget_uuid)
      #get page
      if p = w.page
        return p.document.uuid
      end
    end
 
    return nil
  end
  
  def self.can_user_edit_document(document_uuid, user_id)
    #todo
    if(user_id == nil)
      return false
    end

    return true
  end
  
  def self.can_user_read_document(document_uuid, user_id)
    #todo
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
  
  #return all datastore entries for the current user
  #and linked to items, medias, pages and documents info 
  def self.all_for_user_with_extra_data(user_id)
    @join = "INNER JOIN items ON datastore_entries.widget_uuid=items.uuid"
    @join += " INNER JOIN medias ON items.media_id=medias.id"
    @join += " INNER JOIN pages ON items.page_id=pages.id"
    @join += " INNER JOIN documents ON pages.document_id=documents.id "
    @select = "documents.title,documents.uuid"
    @select += ",items.id as i_id, medias.title as m_title, pages.position as p_position, pages.uuid as p_uuid"
    @select += ",datastore_entries.ds_key as de_key,datastore_entries.ds_value as de_value,datastore_entries.updated_at as de_updated_at"
    @order = "documents.title, documents.id,medias.title,datastore_entries.updated_at"

    return DatastoreEntry.find(:all,:select => @select, :joins=>@join, :order=>@order, :conditions => {:user_id => user_id})
  end
  
  # ====================
  # = Instance Methods =
  # ====================
end

# == Schema Information
#
# Table name: datastore_entries
#
#  id          :integer         not null, primary key
#  ds_key      :string(255)     not null
#  ds_value    :text(65537)     not null
#  widget_uuid :text
#  user_id     :string(36)
#  created_at  :datetime
#  updated_at  :datetime
#

