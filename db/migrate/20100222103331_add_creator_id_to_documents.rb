class AddCreatorIdToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :creator_id, :integer
    
    Document.all.each do |document|
      begin
        if role = document.accepted_roles.first(:conditions => { :name => 'owner' })
          # JBA do not add condition to sort by createion date because it fails on ysql
          document.creator = role.users.first
          document.save
        end
      rescue => e
        puts "Error adding creator to document #{document.id} - #{document.title} - #{e}"
      end
    end
    
    # Update roles
    Role.all(:conditions => { :name => 'owner' }).each do |role|
      count = Role.all(:conditions => { :name => 'editor', :authorizable_type => role.authorizable_type, :authorizable_id => role.authorizable_id }).count
      if count > 0 # editor on same document already exists, so delete current record
        role.destroy
      else
        role.name = "editor"
        role.save
      end
    end
    puts "Roles owner updated to editor"
  end
  
  def self.down
    remove_column :documents, :creator_id
  end
end