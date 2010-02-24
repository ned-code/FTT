class AddPlubicBooleanToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :public, :boolean, :default => false
    
    Document.all.each do |document|
      begin
        if document.users.select { |user| user.username == 'all' }.present?
          document.update_attribute(:public, true)
        end
      rescue
        puts "Error adding public to document #{document.id} - #{document.title}"
      end
    end
    global_user = User.find_by_username("all")
    global_user.has_no_roles! if global_user
    global_user.destroy if global_user
  end
  
  def self.down
    remove_column :documents, :public
  end
end