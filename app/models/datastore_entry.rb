class DatastoreEntry < ActiveRecord::Base
  
  attr_accessible :ds_key, :ds_value
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :item
  belongs_to :user
  
  named_scope :filter_with, lambda { |params|
    conditions = {}
    conditions[:ds_key]  = params[:key] if params.has_key?(:key)
    conditions[:user_id] = current_user if current_user && params[:only_current_user] == 'true'
    { :conditions => { :datastore_entries => conditions } }
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
  
  def to_json(options = {})
    options[:only] ||= []
    options[:methods] ||= []
    
    if current_user && current_user.has_role?("editor", item.page.document)
      options[:only]    = [:ds_key, :ds_value, :updated_at]
      options[:methods] = [:email]
    else
      options[:only]    = [:ds_key, :ds_value]
      options[:methods] = [:email]
    end
    
    super(options)
  end
  
  # =================
  # = Class Methods =
  # =================
  
  def self.create_or_update(item, params)
    key_to_save = nil
    #check if the key already exists
    if params[:unique_key] == 'true'
      existing_key = DatastoreEntry.find(:first, :conditions => { :ds_key => params[:key], :item_id => item.id })
      if existing_key && (existing_key.user_id == nil || (current_user && existing_key.user_id == current_user.id))
        key_to_save = existing_key
      else
        key_to_save = DatastoreEntry.new
      end
    else #record is not unique
      #is user connected
      if current_user
        #has already a record for itself
        key_to_save = DatastoreEntry.find(:first,:conditions => { :ds_key => params[:key], :item_id => item.id, :user_id => current_user.id })
        unless key_to_save 
          key_to_save = DatastoreEntry.new
        end
      else
        #TODO manage anonymous user
        key_to_save = DatastoreEntry.new
      end
    end
    
    if key_to_save 
      key_to_save.ds_key = params[:key]
      key_to_save.ds_value = params[:value]
      key_to_save.item_id = item.id
      if current_user
        key_to_save.user_id = current_user.id
      else
        #TODO manage anonymous user
      end
      key_to_save.save
    end
  end
  
  #return all datastore entries for the current user
  #and linked to items, medias, pages and documents info 
  def self.all_for_current_user_documents
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
      :conditions => { :documents => { :creator_id => current_user.id } }
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

# Table name: datastore_entries
#
#  id         :integer         not null, primary key
#  ds_key     :string(255)     not null
#  ds_value   :text(65537)     not null
#  user_id    :string(36)
#  created_at :datetime
#  updated_at :datetime
#  item_id    :integer
#

