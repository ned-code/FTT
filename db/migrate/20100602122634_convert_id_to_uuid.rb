class ConvertIdToUuid < ActiveRecord::Migration
  def self.up
    #create and fill the uuid column in model
    #where it was not present
    
    #Category
    add_column :categories, :uuid, :string, :limit => 36
    Category.set_primary_key :id
    Category.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    #DatastoreEntry
    add_column :datastore_entries, :uuid, :string, :limit => 36
    DatastoreEntry.set_primary_key :id
    DatastoreEntry.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :followships, :uuid, :string, :limit => 36
    Followship.set_primary_key :id
    Followship.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :roles, :uuid, :string, :limit => 36
    Role.set_primary_key :id
    Role.all.each do |record|
      record.update_attribute(:uuid, UUID::generate)
    end
    
    add_column :view_counts, :uuid, :string, :limit => 36
    ViewCount.set_primary_key :id
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
    
    # #Datastore
    DatastoreEntry.all.each do |d|
      user = User.find(:first, :conditions => { :id => d.user_id })
      if user
        d.user_id = user.uuid
      end
      item = Item.find(:first, :conditions => { :id => d.item_id })
      if item
        d.item_id = item.uuid
      end
      d.save!
    end
    
    #Document
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
        #64 is the length of :uuid/css/parsed_theme_style.css which sould be common between local and S3
        d.style_url = "#{s[0..(d.style_url.length-64)]}#{theme.uuid}/css/parsed_theme_style.css"
      end
      d.save!
    end
    
    #Followship
    Followship.all.each do |f|
      user = User.find(f.follower_id)
      f.follower_id = user.uuid
      user = User.find(f.following_id)
      f.following_id = user.uuid
      f.save!
    end
    
    #Item
    Item.all.each do |i|
      page = Page.find(:first, :conditions => {:id => i.page_id})
      if page
        i.page_id = page.uuid
      end
      media = Media.find(:first, :conditions => {:id => i.media_id})
      if media
        i.media_id = media.uuid
      end
      i.save!
    end
    
    #layout
    Layout.all.each do |l|
      theme = Theme.find(:first, :conditions => { :id => l.theme_id })
      if theme
        l.theme_id = theme.uuid
      end
      page = Page.find(:first, :conditions => { :id => l.model_page_id })
      if page
        l.model_page_id = page.uuid
      end
      l.save!
    end
    
    #Media
    Media.all.each do |m|
      user = User.find(:first, :conditions => { :id => m.user_id})
      m.user_id = user.uuid
      m.save!
    end
    
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
      p.save!
    end
    
    #Role
    Role.set_primary_key :id
    Role.all.each do |r|
      if !r.authorizable_id.nil?
        class_name = r.authorizable_type.camelize.constantize
        item = class_name.find(:first, :conditions => { :id => r.authorizable_id} )
        execute "UPDATE roles SET authorizable_id='#{item.uuid}' where id='#{r.id}'"
      end
    end    
          
    #Role User    
    RolesUser.all.each do |r|
      User.set_primary_key :id
      Role.set_primary_key :id
      
      user = User.find(:first, :select => 'id, uuid', :conditions => { :id => r.user_id })
      role = Role.find(:first, :select => 'id, uuid', :conditions => { :id => r.role_id })

      execute "UPDATE roles_users SET user_id='#{user.uuid}' where user_id='#{r.user_id}' AND role_id='#{r.role_id}'"
      execute "UPDATE roles_users SET role_id='#{role.uuid}' where user_id='#{user.uuid}' AND role_id='#{r.role_id}'"
    end
    
    #Theme
    Theme.all.each do |t|
      if !t.updated_theme_id.nil?
        theme = Theme.find(:first, :conditions => { :id => t.updated_theme_id })
        t.updated_theme_id = theme.uuid
        t.save!
      end
    end
  end

  def self.down  
    raise ActiveRecord::IrreversibleMigration
  end
end
