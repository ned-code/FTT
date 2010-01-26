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

