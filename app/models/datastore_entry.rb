class DatastoreEntry < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  CONST_PROTECTION_LEVEL_PRIVATE = 0
  CONST_PROTECTION_LEVEL_READ = 1
  CONST_PROTECTION_LEVEL_READ_WRITE = 2
  
  attr_accessible :ds_key, :ds_value, :uuid
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :item
  belongs_to :user
  
  scope :filter_with, lambda { |current_user, params|
    #conditions = {}
    #conditions[:ds_key]  = params[:key] if params.has_key?(:key)
    #conditions[:user_id] = current_user if current_user && params[:only_current_user] == 'true'
    #{ :conditions => { :datastore_entries => conditions } }
    
    conditions = Array.new
    if current_user #can read if owner or is public read
      if params[:only_current_user].present? && params[:only_current_user] == true
        conditions[0] = 'user_id = ?'
        conditions << current_user  
      else
        conditions[0] = '(user_id = ? OR protection_level <> ?)'
        conditions << current_user
        conditions << CONST_PROTECTION_LEVEL_PRIVATE
      end
    else #no user, can only read if public read
      if params[:only_current_user].present? && params[:only_current_user] == true
        conditions[0] = 'NULL IS NOT ?'
        conditions << nil
      else
        conditions[0] = 'protection_level <> ?'
        conditions << CONST_PROTECTION_LEVEL_PRIVATE
      end
    end
    
    if params[:key].present? #check a particular key?
      conditions[0] += ' AND ds_key = ?'
      conditions << params[:key]
    end
    
    { :conditions => conditions }
  }
  
  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :ds_key
  validates_presence_of :item_id
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def email
    user.email if user
  end
  
  def filtered_json(current_user, options = {})
    options[:only] ||= []
    options[:methods] ||= []
    
    if current_user && current_user.has_role?("editor", item.page.document)
      options[:only]    = [:ds_key, :ds_value, :updated_at]
      options[:methods] = [:email]
    else
      options[:only]    = [:ds_key, :ds_value]
    end
    
    as_json(options)
  end
  
  # =================
  # = Class Methods =
  # =================
  
  def self.create_or_update(current_user, item, params)
    key_to_save = nil
    #check if the key already exists
    if params[:unique_key] == 'true'
      existing_key = DatastoreEntry.find(:first, :conditions => { :ds_key => params[:key], :item_id => item.uuid })
      if existing_key && (existing_key.user_id == nil || existing_key.protection_level=CONST_PROTECTION_LEVEL_READ_WRITE || (current_user && existing_key.user_id == current_user.uuid))
        key_to_save = existing_key
      else
        key_to_save = DatastoreEntry.new
        key_to_save.protection_level = params[:protection_level] != nil ? params[:protection_level] : 0;
      end
    else #record is not unique
      #is user connected
      if current_user
        #has already a record for itself
        key_to_save = DatastoreEntry.find(:first,:conditions => { :ds_key => params[:key], :item_id => item.uuid, :user_id => current_user.uuid })
        unless key_to_save 
          key_to_save = DatastoreEntry.new
          key_to_save.protection_level = params[:protection_level] != nil ? params[:protection_level] : 0;
        end
      else
        #TODO manage anonymous user
        key_to_save = DatastoreEntry.new
        key_to_save.protection_level = params[:protection_level] != nil ? params[:protection_level] : 0;
      end
    end
    
    if key_to_save 
      key_to_save.ds_key = params[:key]
      key_to_save.ds_value = params[:value]
      key_to_save.item_id = item.uuid
      if current_user
        key_to_save.user_id = current_user.uuid
      else
        #TODO manage anonymous user
      end
      key_to_save.save
      return key_to_save
    end
    return nil
  end
  
  #return all datastore entries for the current user
  #and linked to items, medias, pages and documents info 
  def self.all_for_current_user_documents(current_user)
    #try to find an optimized solution
    # current_user.documents.inject([]) do |datastore_entries, document|
    #   document.pages.each do |page|
    #     page.items.find_all_by_media_type("widget").each do |widget|
    #       datastore_entries.concat widget.datastore_entries
    #     end
    #   end
    #   datastore_entries
    # end
    find(
      :all,
      :joins => { :item => { :page => :document } },
      :conditions => { :documents => { :creator_id => current_user.uuid } }
    )
    
    # @join = "INNER JOIN items ON datastore_entries.item_id=items.id"
    # @join += " INNER JOIN medias ON items.media_id=medias.id"
    # @join += " INNER JOIN pages ON items.page_id=pages.id"
    # @join += " INNER JOIN documents ON pages.document_id=documents.id "
    # @select = "documents.title,documents.uuid"
    # @select += ",items.id as i_id, medias.title as m_title, pages.position as p_position, pages.uuid as p_uuid"
    # @select += ",datastore_entries.id as de_id,datastore_entries.ds_key as de_key,datastore_entries.ds_value as de_value,datastore_entries.updated_at as de_updated_at"
    # @order = "documents.title, documents.id,medias.title,datastore_entries.updated_at"
    # 
    # return DatastoreEntry.find(:all,:select => @select, :joins=>@join, :order=>@order, :conditions => {:user_id => current_user.id})
  end
  
end



# == Schema Information
#
# Table name: datastore_entries
#
#  ds_key           :string(255)     not null
#  ds_value         :text(16777215)  default(""), not null
#  user_id          :string(36)
#  created_at       :datetime
#  updated_at       :datetime
#  item_id          :string(36)
#  uuid             :string(36)      default(""), not null, primary key
#  protection_level :integer(4)      default(0), not null
#

