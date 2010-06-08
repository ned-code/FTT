namespace :themes do
  desc "Add default themes (public/themes/default/Archive.zip) useful in dev"
  task :add_default => :environment do
    theme = { :file => File.new("#{RAILS_ROOT}/public/themes/default/Archive.zip"), :is_default => "1"}
    t = Theme.new(theme)
    if t.set_attributes_from_config_file_and_save
      p "Default theme added"
    end
  end
  
  desc "force document.theme_id to use new uploaded Theme"
  task :force_document_theme_id_update => :environment do
    Document.all.each do |d|
      theme = d.theme
      if theme.nil?
        d.theme_id = Theme.default.id
        d.style_url = Theme.default.style_url
      else
        updated_theme = Theme.find(:first, :conditions => { :uuid => theme.updated_theme_id })
        
        #We force to update to the last version of theme !
        while !updated_theme.updated_theme_id.nil?
          updated_theme = Theme.find(:first, :conditions => { :uuid => updated_theme.updated_theme_id })
        end
        
        d.theme_id = updated_theme.id
        d.style_url = updated_theme.style_url
      end
      d.save(false)
    end
  end
end