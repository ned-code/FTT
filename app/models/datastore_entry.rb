class DatastoreEntry < ActiveRecord::Base    
  # ================
  # = Associations =
  # ================
  belongs_to :widget, :class_name => "Medias::Widget"
  belongs_to :user
  
  # ===============
  # = Validations =
  # ===============
  validates_presence_of :ds_key
  validates_presence_of :widget_uuid

  # =================
  # = Class Methods =
  # =================
  def self.createOrUpdate(datastore_id, key, value, is_unique)
    key_to_save = nil
    #check if the key already exists
    if(is_unique)
      existing_key = DatastoreEntry.find(:first,:conditions => {:ds_key => key, :widget_uuid => datastore_id})
      if (existing_key && (existing_key.user_id == nil || exist_key.user_id == current_user.id))
        key_to_save = existing_key
      else
        key_to_save = DatastoreEntry.new
      end
    else #record is not unique
      #is user connected
      if(current_user)
        #has already a record for itself
        key_to_save = DatastoreEntry.find(:first,:conditions => {:ds_key => key, :widget_uuid => datastore_id, :user_id => current_user.id})
        unless key_to_save 
          key_to_save = DatastoreEntry.new
        end
      else
        #TODO manage anonymous user
        key_to_save = DatastoreEntry.new
      end
    end
    
    if(key_to_save)
      key_to_save.ds_key = key
      key_to_save.ds_value = value
      key_to_save.widget_uuid = datastore_id
      if (current_user)
        key_to_save.user_id = current_user.id
      else
        #TODO manage anonymous user
      end    
      key_to_save.save
    end    
  end
  
  def self.getAllDatastoreEntries(datastore_id, key, only_current_user)
    if(only_current_user)
      if (current_user)
        DatastoreEntry.find(:all, :conditions => {:ds_key => key, :widget_uuid => datastore_id, :user_id => current_user.id})
      else
        #TODO need to manage anonymous user
      end
    else
      DatastoreEntry.find(:all, :conditions => {:ds_key => key, :widget_uuid => datastore_id})
    end
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
    @select += ",datastore_entries.id as de_id,datastore_entries.ds_key as de_key,datastore_entries.ds_value as de_value,datastore_entries.updated_at as de_updated_at"
    @order = "documents.title, documents.id,medias.title,datastore_entries.updated_at"
    
    return DatastoreEntry.find(:all,:select => @select, :joins=>@join, :order=>@order, :conditions => {:user_id => user_id})
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def email
    user.email
  end
  
end


# == Schema Information
#
# Table name: datastore_entries
#
#  id          :integer(4)      not null, primary key
#  ds_key      :string(255)     not null
#  ds_value    :text(16777215)  default(""), not null
#  widget_uuid :string(36)
#  user_id     :string(36)
#  created_at  :datetime
#  updated_at  :datetime
#
