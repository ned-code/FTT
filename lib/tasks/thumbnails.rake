namespace :thumbnails do
  desc "Refresh all page thumbnails"
  task :refresh_all_pages => :environment do
    Page.all(:conditions => ['(layout_kind is ? OR layout_kind = ?) AND (thumbnail_need_update IS ? OR thumbnail_need_update = ?)', nil, 'null', nil, 0]).each do |page|
      page.thumbnail_need_update = true
      page.save!
    end
  end
end