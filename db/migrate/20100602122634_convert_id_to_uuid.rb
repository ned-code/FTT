class ConvertIdToUuid < ActiveRecord::Migration
  def self.up
    #create and fill the uuid column in model
    #where it was not present
    
    #setting primary key to id (it's uuid in the model file)
    Category.set_primary_key :id
    DatastoreEntry.set_primary_key :id
    Document.set_primary_key :id
    Followship.set_primary_key :id
    Item.set_primary_key :id
    Media.set_primary_key :id
    Page.set_primary_key :id
    Role.set_primary_key :id
    Theme.set_primary_key :id
    User.set_primary_key :id
    ViewCount.set_primary_key :id
    
    #Category
    add_column :categories, :uuid, :string, :limit => 36
    Category.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    #DatastoreEntry
    add_column :datastore_entries, :uuid, :string, :limit => 36
    DatastoreEntry.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :followships, :uuid, :string, :limit => 36
    Followship.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :roles, :uuid, :string, :limit => 36
    Role.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :view_counts, :uuid, :string, :limit => 36
    ViewCount.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    #update Foreign key...
        
    change_column :datastore_entries, :item_id, :string, :limit => 36
    change_column :datastore_entries, :user_id, :string, :limit => 36
    
    change_column :documents, :category_id, :string, :limit => 36
    change_column :documents, :creator_id, :string, :limit => 36
    change_column :documents, :theme_id, :string, :limit => 36
    
    change_column :followships, :follower_id, :string, :limit => 36
    change_column :followships, :following_id, :string, :limit => 36
    
    change_column :items, :page_id, :string, :limit => 36
    change_column :items, :media_id, :string, :limit => 36
    
    change_column :layouts, :theme_id, :string, :limit => 36
    change_column :layouts, :model_page_id, :string, :limit => 36
    
    change_column :medias, :user_id, :string, :limit => 36
    
    change_column :pages, :document_id, :string, :limit => 36
    change_column :pages, :thumbnail_id, :string, :limit => 36
    
    change_column :roles, :authorizable_id, :string, :limit => 36
    
    change_column :roles_users, :user_id, :string, :limit => 36
    change_column :roles_users, :role_id, :string, :limit => 36
    
    change_column :themes, :id, :string, :limit => 36
    change_column :themes, :updated_theme_id, :string, :limit => 36
    
    change_column :users, :id, :string, :limit => 36
    
    change_column :view_counts, :id, :string, :limit => 36
    change_column :view_counts, :user_id, :string, :limit => 36
    change_column :view_counts, :viewable_id, :string, :limit => 36
    
    p "updating tables. This could take a lot of time !"
    
    # #Datastore
    p "updating Datastore"
    DatastoreEntry.all.each do |d|
      user = User.find(:first, :conditions => { :id => d.user_id })
      if user
        user_uuid = user.uuid
      end
      item = Item.find(:first, :conditions => { :id => d.item_id })
      if item
        item_uuid = item.uuid
      end
      if item_uuid
        execute "UPDATE datastore_entries SET item_id='#{item_uuid}' where id='#{d.id}'"
      end
      if user_uuid
        execute "UPDATE datastore_entries SET user_id='#{user_uuid}' where id='#{d.id}'"
      end
      d.save(false)
    end
    
    #Document
    p "updating Document"
    theme_default = Theme.default
    Document.all.each do |d|
      user = User.find(:first, :conditions => { :id => d.creator_id })
      if user
        d.creator_id = user.uuid
      end
      category = Category.find(:first, :conditions => { :id => d.category_id})
      if category
        d.category_id = category.uuid
      end
      theme = Theme.find(:first, :conditions => { :id => d.theme_id})
      if theme
        d.theme_id = theme.uuid
        if !d.style_url.nil?
          #64 is the length of :uuid/css/parsed_theme_style.css which sould be common between local and S3
          d.style_url = "#{d.style_url[0..(d.style_url.length-64)]}#{theme.uuid}/css/parsed_theme_style.css"
        else
          d.style_url = theme.style_url
        end
      else
        #Here we set default theme if there is no theme
        d.theme_id = theme_default.uuid
        d.style_url = theme_default.style_url
      end
      if (d.size.blank? || d.size == 'null')
        size = HashWithIndifferentAccess.new
        size[:width] = '800px'
        size[:height] = '600px'
        d.size = size
      end
      d.save(false)      
    end
      
    #Followship
    p "updating Followship"
    Followship.all.each do |f|
      follower = User.find_by_id(f.follower_id)
      following = User.find_by_id(f.following_id)
      
      #f.save(false)
      if (follower && following)
        execute "UPDATE followships SET follower_id='#{follower.uuid}' where follower_id='#{f.follower_id}' AND following_id='#{f.following_id}'"
        execute "UPDATE followships SET following_id='#{following.uuid}' where follower_id='#{follower.uuid}' AND following_id='#{f.following_id}'"
      end
    end
    
    #Item
    p "updating Item"
    Item.all.each do |i|
      page = Page.find(:first, :conditions => {:id => i.page_id})
      if page
        i.page_id = page.uuid
      end
      media = Media.find(:first, :conditions => {:id => i.media_id})
      if media
        i.media_id = media.uuid
      end
      i.touch_page_active = false
      i.save(false)
    end
    
    #layout
    p "updating Layout"
    Layout.all.each do |l|
      theme = Theme.find(:first, :conditions => { :id => l.theme_id })
      if theme
        l.theme_id = theme.uuid
      end
      page = Page.find(:first, :conditions => { :id => l.model_page_id })
      if page
        l.model_page_id = page.uuid
      end
      l.save(false)
    end
    
    p "updating Media"
    #Media
    Media.all.each do |m|
      user = User.find(:first, :conditions => { :id => m.user_id})
      if user
        m.user_id = user.uuid
        m.save(false)
      end
    end
    
    p "updating Page"
    #Page
    Page.all.each do |p|
      document = Document.find(:first, :conditions => { :id => p.document_id })
      if document
        p.document_id = document.uuid
      end
      thumbnail = Media.find(:first, :conditions => { :id => p.thumbnail_id })
      if thumbnail
        p.thumbnail_id = thumbnail.uuid
      end
      p.touch_document_active = false
      p.save(false)
    end
    
    #Role
    p "updating Role"
    Role.transaction do
      Role.all.each do |r|
        if !r.authorizable_id.nil?
          class_name = r.authorizable_type.camelize.constantize
          item = class_name.find(:first, :conditions => { :id => r.authorizable_id} )
          execute "UPDATE roles SET authorizable_id='#{item.uuid}' where id='#{r.id}'"
        end
      end
    end
          
    #Role User
    p "updating RolesUser"
    RolesUser.transaction do
      RolesUser.all.each do |r|     
        user = User.find(:first, :select => 'id, uuid', :conditions => { :id => r.user_id })
        role = Role.find(:first, :select => 'id, uuid', :conditions => { :id => r.role_id })
      
        execute "UPDATE roles_users SET user_id='#{user.uuid}' where user_id='#{r.user_id}' AND role_id='#{r.role_id}'"
        execute "UPDATE roles_users SET role_id='#{role.uuid}' where user_id='#{user.uuid}' AND role_id='#{r.role_id}'"
      end
    end
    
    #Theme
    p "updating Theme"
    Theme.all.each do |t|
      if !t.updated_theme_id.nil?
        theme = Theme.find(:first, :conditions => { :id => t.updated_theme_id })
        t.updated_theme_id = theme.uuid
        t.save(false)
      end
    end
    
    #View count
    p "updating ViewCount"
    ViewCount.all.each do |v|
      item_uuid = nil
      user_uuid = nil
      class_name = v.viewable_type.camelize.constantize
      item = class_name.find(:first, :conditions => { :id => v.viewable_id} )
      
      if item
        item_uuid = item.uuid
      end
      user = User.find(:first, :select => 'id, uuid', :conditions => { :id => v.user_id })
      if user
        user_uuid = user.uuid
      end
      if !item_uuid.nil?
        execute "UPDATE view_counts SET viewable_id='#{item_uuid}' where id='#{v.id}'"
      end
      if !user_uuid.nil?
        execute "UPDATE view_counts SET user_id='#{user_uuid}' where id='#{v.id}'"
      end
    end
  end

  def self.down  
    raise ActiveRecord::IrreversibleMigration
  end
end
