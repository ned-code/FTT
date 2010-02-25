namespace :roles do
  
  task :migrate_owner => :environment do
    Role.all(:conditions => { :name => 'owner' }).each do |role|
      count = Role.all(:conditions => { :name => 'editor', :authorizable_type => role.authorizable_type, :authorizable_id => role.authorizable_id }).count
      if count > 0 # editor on same document already exists, so delete current record
        role.destroy
      else
        role.name = "editor"
        role.save
      end
    end
  end
  
end