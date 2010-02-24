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
  end
  
  def self.down
    remove_column :documents, :creator_id
  end
end