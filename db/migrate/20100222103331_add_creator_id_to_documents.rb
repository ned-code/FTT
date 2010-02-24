class AddCreatorIdToDocuments < ActiveRecord::Migration
  def self.up
    add_column    :documents, :creator_id, :integer
    
    Document.all.each do |doc|
       begin
         roles = Role.find_by_sql("SELECT * from roles r WHERE r.name ='owner' AND r.authorizable_id = #{doc.id}")
         if roles.length > 0
           role = roles[0]
           creator_id = RolesUser.first(:conditions => "role_id = #{role.id}").user_id
           doc.creator_id = creator_id
           doc.save
         end
       rescue
         #Do nothing
         puts "Error adding creator to document #{doc.id} - #{doc.title}"
       end
     end
  end

  def self.down
    remove_column :documents, :creator_id
  end
end
