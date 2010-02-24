class AddCreatorIdToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :creator_id, :integer
    
    Document.all.each do |document|
      begin
        if role = document.accepted_roles.first(:conditions => { :name => 'owner' })
          document.creator = role.users.first(:order => :created_at)
          document.save
        end
      rescue
        puts "Error adding creator to document #{document.id} - #{document.title}"
      end
    end
  end
  
  def self.down
    remove_column :documents, :creator_id
  end
end