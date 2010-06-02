namespace :themes do
  desc "Add default themes (public/themes/default/Archive.zip) useful in dev"
  task :add_default => :environment do
    theme = { :file => File.new("#{RAILS_ROOT}/public/themes/default/Archive.zip"), :is_default => "1"}
    t = Theme.new(theme)
    if t.set_attributes_from_config_file_and_save
      p "Default theme added"
    end
  end
end