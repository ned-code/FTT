class UpdateVideosAndImagesForMediaBrowser < ActiveRecord::Migration
  def self.up
    medias = Media.all
    medias.each do |m|
      if m.type == 'Medias::Video'
        m.favorites = true
        m.save!
      end
    end
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
