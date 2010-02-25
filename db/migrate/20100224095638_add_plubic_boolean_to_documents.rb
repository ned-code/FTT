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
    
    # Wanted to execute the following code but the database is locked while migrating, so rake task fails
    # Use rake roles:migrate_owner instead
    
    # arguments = 'roles:migrate_owner'
    # if RUBY_PLATFORM =~ /mswin/
    #  rake_cmd = "rake.bat" #very important because windows will break with just "rake"
    # else
    #  rake_cmd = "rake"
    # end
    # puts "calling #{rake_cmd} " + arguments
    # puts system("#{rake_cmd} " + arguments)
  end
  
  def self.down
    remove_column :documents, :public
  end
end